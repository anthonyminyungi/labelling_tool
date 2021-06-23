import React, { useRef, useState, useCallback } from 'react';

import './style.scss';

const zoomableMap = {
  n: 't',
  s: 'b',
  e: 'r',
  w: 'l',
  ne: 'tr',
  nw: 'tl',
  se: 'br',
  sw: 'bl',
};

const direction = Object.keys(zoomableMap);

const Label = props => {
  const {
    labels,
    index,
    id,
    startX,
    startY,
    width,
    height,
    setLabels,
    selected,
    onClick,
    topOffset,
    leftOffset,
  } = props;

  const [rotateAngle, setRotateAngle] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  const rightLimit = window.innerWidth - leftOffset;
  const bottomLimit = window.innerHeight - topOffset;

  const handleDrag = useCallback(
    (deltaX, deltaY) => {
      let currentLabels = [...labels];
      let currentLabel = labels[index];
      currentLabel = {
        ...currentLabel,
        startX: Math.max(Math.min(startX + deltaX, rightLimit - width), 0),
        startY: Math.max(Math.min(startY + deltaY, bottomLimit - height), 0),
        endX: Math.min(Math.max(startX + deltaX, 0) + width, rightLimit),
        endY: Math.min(Math.max(startY + deltaY, 0) + height, bottomLimit),
      };
      currentLabels.splice(index, 1, currentLabel);
      setLabels(currentLabels);
    },
    [
      bottomLimit,
      height,
      index,
      labels,
      rightLimit,
      setLabels,
      startX,
      startY,
      width,
    ]
  );

  const handleStartDrag = useCallback(
    e => {
      setIsMouseDown(true);
      setDragStartX(e.clientX);
      setDragStartY(e.clientY);

      const onMove = e => {
        if (!isMouseDown) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;

        handleDrag(deltaX, deltaY);
        setDragStartX(clientX);
        setDragStartY(clientY);
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!isMouseDown) return;
        setIsMouseDown(false);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [dragStartX, dragStartY, handleDrag, isMouseDown]
  );

  const style = {
    position: 'absolute',
    left: startX,
    top: startY,
    width,
    height,
    backgroundColor: 'rgba(86,104,217,0.2)',
    border: '3px solid #5668D9',
  };

  console.log(selected);
  return (
    <div
      id={id}
      className="board-label-box rect single-resizer"
      style={style}
      onClick={onClick}
      onMouseDown={handleStartDrag}
      tabIndex="-1"
    >
      {selected && (
        <React.Fragment>
          <div className="rotate">
            <div className="rotate-circle" />
            <div className="rotate-bar" />
          </div>

          {direction.map(d => (
            <div key={d} className={`${zoomableMap[d]} square`} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default Label;
