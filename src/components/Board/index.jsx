import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { randomBytes } from 'crypto';

import Label from '../Label';
import { getBoardImage, getCurrentMenu } from '../../redux/selectors';
import './style.scss';

const Board = () => {
  const [boardImage, currentMenu] = useSelector(state => [
    getBoardImage(state),
    getCurrentMenu(state),
  ]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [rect, setRect] = useState({});
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const context = canvasRef.current?.getContext('2d');

  const handleMouseDown = useCallback(
    e => {
      setRect({
        ...rect,
        startX: e.offsetX,
        startY: e.offsetY,
      });
      setDrag(true);
    },
    [rect]
  );

  const handleMouseUp = useCallback(
    e => {
      setDrag(false);
      setLabels([
        ...labels,
        {
          ...rect,
          endX: e.offsetX,
          endY: e.offsetY,
          leftOffset: canvasRef.current?.offsetLeft,
          topOffset: canvasRef?.current.offsetTop,
          id: `board-label-${randomBytes(16).toString('hex')}`,
        },
      ]);
      setRect({});
      context?.clearRect(
        0,
        0,
        canvasRef.current?.clientWidth,
        canvasRef.current?.clientHeight
      );
    },
    [context, labels, rect]
  );

  const draw = useCallback(() => {
    context.setLineDash([]);
    context.lineWidth = 3;
    context.fillStyle = 'rgba(86,104,217,0.2)';
    context.strokeStyle = '#5668D9';
    context.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
    context.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  }, [context, rect.h, rect.startX, rect.startY, rect.w]);

  const handleMouseMove = useCallback(
    e => {
      if (drag) {
        setRect({
          ...rect,
          w: e.offsetX - rect.startX,
          h: e.offsetY - rect.startY,
        });
        context?.clearRect(
          0,
          0,
          canvasRef.current?.clientWidth,
          canvasRef.current?.clientHeight
        );
        draw();
      }
    },
    [context, drag, draw, rect]
  );

  const handleClickLabel = useCallback(
    e => {
      if (currentMenu === 'SELECT') {
        const clicked = labels.filter(label => label.id === e.target.id)[0];
        if (selectedLabels.includes(clicked)) {
          setSelectedLabels(
            selectedLabels.filter(selected => selected.id !== clicked.id)
            // []
          );
        } else {
          setSelectedLabels([...selectedLabels, clicked]);
        }
      }
    },
    [currentMenu, labels, selectedLabels]
  );

  const handleDeleteLabel = useCallback(
    e => {
      if (
        currentMenu === 'SELECT' &&
        selectedLabels.length > 0 &&
        (e.code === 'Delete' || e.code === 'Backspace')
      ) {
        const afterDeletion = [];
        labels.forEach(label => {
          if (!selectedLabels.includes(label)) {
            afterDeletion.push(label);
          }
        });
        setLabels(afterDeletion);
        setSelectedLabels([]);
      }
    },
    [currentMenu, labels, selectedLabels]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (currentMenu === 'CREATE') {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [currentMenu, handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }, [boardImage, context]);

  //   console.log(labels);
  //   console.log(selectedLabels);
  return (
    <div
      className="board-container"
      ref={containerRef}
      onKeyDown={handleDeleteLabel}
    >
      <canvas
        style={{ background: `url(${boardImage.url}) no-repeat center` }}
        className="board-canvas"
        ref={canvasRef}
      />
      {labels.map((label, index) => {
        return (
          <Label
            key={label.id}
            startX={Math.min(label.endX, label.startX) + label.leftOffset}
            startY={Math.min(label.endY, label.startY) + label.topOffset}
            width={Math.abs(label.w)}
            height={Math.abs(label.h)}
            labels={labels}
            index={index}
            // labelObject={label}
            setLabels={setLabels}
            id={label.id}
            onClick={handleClickLabel}
            selected={selectedLabels.includes(label)}
          />
        );
      })}
    </div>
  );
};

export default Board;
