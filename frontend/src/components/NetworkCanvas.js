import React, { useState, useRef } from 'react';
import { Stage, Layer, Circle, Text, Line } from 'react-konva';

const GRID_SIZE = 50;
const MSC_RANGE = 300;

const getTowerRange = (height) => height * 10;

const distance = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

const NetworkCanvas = () => {
  const [elements, setElements] = useState([]);
  const [mode, setMode] = useState('msc'); // msc, tower, user, delete
  const [heightInput, setHeightInput] = useState(10);
  const stageRef = useRef();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? scale / scaleBy : scale * scaleBy;
    setScale(newScale);
  };

  const handleDragMove = (e) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleStageClick = (e) => {
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();

    const canvasX = (pointer.x - position.x) / scale;
    const canvasY = (pointer.y - position.y) / scale;

    // Handle deletion
    if (mode === 'delete') {
      let updated = [...elements];
      let deleted = false;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (distance(el.x, el.y, canvasX, canvasY) < 15) {
          updated.splice(i, 1);
          deleted = true;
          break;
        }
      }

      if (deleted) setElements(updated);
      return;
    }

    if (mode === 'msc') {
      const overlapping = elements.some(
        (el) =>
          el.type === 'msc' &&
          distance(el.x, el.y, canvasX, canvasY) < MSC_RANGE * 2
      );
      if (overlapping) {
        alert('Cannot place MSC inside another MSC’s range');
        return;
      }

      setElements([...elements, { type: 'msc', x: canvasX, y: canvasY }]);
    }

    else if (mode === 'tower') {
      const inRange = elements.some(
        (el) =>
          el.type === 'msc' &&
          distance(el.x, el.y, canvasX, canvasY) <= MSC_RANGE
      );

      if (!inRange) {
        alert('Tower must be inside an MSC’s range');
        return;
      }

      setElements([
        ...elements,
        { type: 'tower', x: canvasX, y: canvasY, height: heightInput }
      ]);
    }

    else if (mode === 'user') {
      const inTower = elements.some((el) => {
        if (el.type === 'tower') {
          const range = getTowerRange(el.height);
          return distance(el.x, el.y, canvasX, canvasY) <= range;
        }
        return false;
      });

      if (!inTower) {
        alert('User must be inside some tower’s range');
        return;
      }

      setElements([...elements, { type: 'user', x: canvasX, y: canvasY }]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label><strong>Mode:</strong>&nbsp;</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="msc">MSC</option>
          <option value="tower">Tower</option>
          <option value="user">User</option>
          <option value="delete">Delete</option> {/* ✅ New option */}
        </select>
        {mode === 'tower' && (
          <>
            &nbsp;&nbsp;
            <label>Height:</label>
            <input
              type="number"
              value={heightInput}
              onChange={(e) => setHeightInput(Number(e.target.value))}
              style={{ width: '60px', marginLeft: '5px' }}
            />
          </>
        )}
      </div>

      <Stage
        width={window.innerWidth}
        height={600}
        onClick={handleStageClick}
        draggable
        onDragMove={handleDragMove}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        ref={stageRef}
        style={{ border: '2px solid gray', background: '#fefefe' }}
      >
        <Layer>
          {/* Grid Lines */}
          {[...Array(200)].map((_, i) => (
            <React.Fragment key={i}>
              <Line
                points={[i * GRID_SIZE, 0, i * GRID_SIZE, 5000]}
                stroke="#ddd"
                strokeWidth={1}
              />
              <Line
                points={[0, i * GRID_SIZE, 5000, i * GRID_SIZE]}
                stroke="#ddd"
                strokeWidth={1}
              />
            </React.Fragment>
          ))}

          {/* Network Elements */}
          {elements.map((el, i) => {
            if (el.type === 'msc') {
              return (
                <React.Fragment key={i}>
                  <Circle
                    x={el.x}
                    y={el.y}
                    radius={MSC_RANGE}
                    fill="rgba(0,0,255,0.05)"
                  />
                  <Circle x={el.x} y={el.y} radius={10} fill="blue" />
                  <Text text="MSC" x={el.x - 15} y={el.y + 12} />
                </React.Fragment>
              );
            }

            if (el.type === 'tower') {
              const range = getTowerRange(el.height);
              return (
                <React.Fragment key={i}>
                  <Circle
                    x={el.x}
                    y={el.y}
                    radius={range}
                    fill="rgba(255,0,0,0.1)"
                  />
                  <Circle x={el.x} y={el.y} radius={10} fill="red" />
                  <Text
                    text={`Tower (h=${el.height})`}
                    x={el.x - 40}
                    y={el.y + 12}
                  />
                </React.Fragment>
              );
            }

            if (el.type === 'user') {
              return (
                <React.Fragment key={i}>
                  <Circle x={el.x} y={el.y} radius={8} fill="green" />
                  <Text text="User" x={el.x - 20} y={el.y + 10} />
                </React.Fragment>
              );
            }

            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default NetworkCanvas;
