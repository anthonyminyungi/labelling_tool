import React, { useRef, useState, useCallback } from 'react';

import {
  getLength,
  getAngle,
  getCursor,
  centerToTL,
  tLToCenter,
  getNewStyle,
  degToRadian,
} from '../../utils';
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

  const labelBoxRef = useRef(null);

  const parentRotateAngle = 0;
  const minWidth = 10;
  const minHeight = 10;
  const aspectRatio = false;

  const [rotateAngle, setRotateAngle] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

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
      const { clientX: dragStartX, clientY: dragStartY } = e;
      const onMove = e => {
        if (!isMouseDown) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;

        handleDrag(deltaX, deltaY);
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
    [handleDrag, isMouseDown]
  );

  const handleResize = useCallback(
    (length, alpha, rect, type, isShiftKey) => {
      const beta = alpha - degToRadian(rotateAngle + parentRotateAngle);
      const deltaW = length * Math.cos(beta);
      const deltaH = length * Math.sin(beta);
      const ratio = isShiftKey && !aspectRatio ? rect.width / rect.height : 0;
      const {
        position: { centerX, centerY },
        size: { width: _width, height: _height },
      } = getNewStyle(
        type,
        { ...rect, rotateAngle },
        deltaW,
        deltaH,
        ratio,
        minWidth,
        minHeight
      );

      let {
        top: _top,
        left: _left,
        width: __width,
        height: __height,
      } = centerToTL({
        centerX,
        centerY,
        width: _width,
        height: _height,
        rotateAngle,
      });

      console.log(_top, _left, __width, __height);

      let currentLabels = [...labels];
      let currentLabel = labels[index];
      currentLabel = {
        ...currentLabel,
        startX: Math.max(Math.round(_left) - leftOffset, 0),
        startY: Math.max(Math.round(_top) - topOffset, 0),
        endX: Math.min(Math.round(_left) + Math.round(__width), rightLimit),
        endY: Math.min(Math.round(_top) + Math.round(__height), bottomLimit),
        w: Math.round(__width),
        h: Math.round(__height),
      };
      currentLabels.splice(index, 1, currentLabel);
      setLabels(currentLabels);
    },
    [
      aspectRatio,
      bottomLimit,
      index,
      labels,
      leftOffset,
      rightLimit,
      rotateAngle,
      setLabels,
      topOffset,
    ]
  );

  const handleStartResize = useCallback(
    (e, cursor) => {
      if (e.button !== 0) return;
      document.body.style.cursor = cursor;
      const {
        position: { centerX, centerY },
        size: { width: _width, height: _height },
        transform: { rotateAngle: _rotateAngle },
      } = tLToCenter({ top: startY, left: startX, width, height, rotateAngle });
      const { clientX: resizeStartX, clientY: resizeStartY } = e;
      const rect = {
        width: _width,
        height: _height,
        centerX,
        centerY,
        rotateAngle: _rotateAngle,
      };
      const type = e.target.getAttribute('class').split(' ')[0];
      setIsMouseDown(true);

      const onMove = e => {
        if (!isMouseDown) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const deltaX = clientX - resizeStartX;
        const deltaY = clientY - resizeStartY;
        const alpha = Math.atan2(deltaY, deltaX);
        const deltaL = getLength(deltaX, deltaY);
        const isShiftKey = e.shiftKey;
        handleResize(deltaL, alpha, rect, type, isShiftKey);
      };

      const onUp = () => {
        document.body.style.cursor = 'auto';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!isMouseDown) return;
        setIsMouseDown(false);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [handleResize, height, isMouseDown, rotateAngle, startX, startY, width]
  );

  const handleRotate = useCallback((angle, startAngle) => {
    let angleToRotate = Math.round(startAngle + angle);
    if (angleToRotate >= 360) {
      angleToRotate -= 360;
    } else if (angleToRotate < 0) {
      angleToRotate += 360;
    }
    if (angleToRotate > 356 || angleToRotate < 4) {
      angleToRotate = 0;
    } else if (angleToRotate > 86 && angleToRotate < 94) {
      angleToRotate = 90;
    } else if (angleToRotate > 176 && angleToRotate < 184) {
      angleToRotate = 180;
    } else if (angleToRotate > 266 && angleToRotate < 274) {
      angleToRotate = 270;
    }
    setRotateAngle(angleToRotate);
  }, []);

  const handleStartRotate = useCallback(
    e => {
      if (e.button !== 0) return;
      const { clientX, clientY } = e;
      const {
        transform: { rotateAngle: startAngle },
      } = tLToCenter({ top: startY, left: startX, width, height, rotateAngle });
      const rect = labelBoxRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const startVector = {
        x: clientX - center.x,
        y: clientY - center.y,
      };
      setIsMouseDown(true);
      const onMove = e => {
        if (!isMouseDown) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;
        const rotateVector = {
          x: clientX - center.x,
          y: clientY - center.y,
        };
        const angle = getAngle(startVector, rotateVector);
        handleRotate(angle, startAngle);
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
    [handleRotate, height, isMouseDown, rotateAngle, startX, startY, width]
  );

  const style = {
    position: 'absolute',
    left: startX,
    top: startY,
    width,
    height,
    backgroundColor: 'rgba(86,104,217,0.2)',
    border: '3px solid #5668D9',
    transform: `rotate(${rotateAngle}deg)`,
  };

  return (
    <div
      id={id}
      className="board-label-box rect single-resizer"
      style={style}
      onClick={onClick}
      onMouseDown={handleStartDrag}
      tabIndex="-1"
      ref={labelBoxRef}
    >
      {selected && (
        <React.Fragment>
          <div className="rotate" onMouseDown={handleStartRotate}>
            <div className="rotate-circle" />
            <div className="rotate-bar" />
          </div>

          {direction.map(d => {
            const cursor = `${getCursor(rotateAngle, d)}-resize`;

            return (
              <div
                key={d}
                style={{ cursor }}
                className={`${zoomableMap[d]} resizable-handler`}
                onMouseDown={e => handleStartResize(e, cursor)}
              />
            );
          })}

          {direction.map(d => (
            <div key={d} className={`${zoomableMap[d]} square`} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default Label;
