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
  } = props;

  const [rotateAngle, setRotateAngle] = useState(0);
  const [isMousedown, setIsMousedown] = useState(false);

  const handleDrag = useCallback(
    (deltaX, deltaY) => {
      //   setLeft(left + deltaX);
      //   setTop(top + deltaY);
      let currentLabels = labels;
      let currentLabel = labels[index];
      currentLabel = {
        ...currentLabel,
        startX: startX + deltaX,
        startY: startY + deltaY,
      };
      //   console.log(currentLabel);
      currentLabels.splice(index, 1, currentLabel);
      setLabels(currentLabels);
    },
    [index, labels, setLabels, startX, startY]
  );

  const startDrag = useCallback(
    e => {
      setIsMousedown(true);
      let { clientX: dragStartX, clientY: dragStartY } = e;

      const onMove = e => {
        if (!isMousedown) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;
        // console.log(deltaX, deltaY);

        handleDrag(deltaX, deltaY);
        dragStartX = clientX;
        dragStartY = clientY;
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!isMousedown) return;
        setIsMousedown(false);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [handleDrag, isMousedown]
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

  //   console.log(selected);
  return (
    <div
      id={id}
      className="board-label-box rect single-resizer"
      style={style}
      onClick={onClick}
      onMouseDown={startDrag}
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
