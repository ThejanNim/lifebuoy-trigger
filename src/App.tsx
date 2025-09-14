import { Suspense, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Loader from "./components/Loader";
import Editor from "./components/Editor";
import { Canvas } from "@react-three/fiber";
import { Object3D } from "three";
import { Panel } from "./components/MultiLeva";

function App() {
  const [selected, setSelected] = useState<Object3D[]>();
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [text, setText] = useState<string | null>(null);

  const shipLength = 300;
  const shipWidth = 50;

  const handleInputChange = (axis: string, value: string) => {
    setCoordinates((prev) => ({
      ...prev,
      [axis]: parseFloat(value) || 0,
    }));
  };

  const isInsideShip = (x: number, y: number) => {
    const minorAxis = shipWidth / 2; // 25

    // Ship sections
    const sternEnd = -150; // Y = -150
    const middleStart = -110; // Y = -110
    const middleEnd = 20; // Y = 20
    const bowEnd = 150; // Y = 150

    // Check Y bounds first
    if (y < sternEnd || y > bowEnd) return false;

    if (y >= sternEnd && y <= middleStart) {
      // Stern section (rectangular)
      return Math.abs(x) <= minorAxis;
    } else if (y >= middleStart && y <= middleEnd) {
      // Middle section (rectangular)
      return Math.abs(x) <= minorAxis;
    } else {
      // Forward section (elliptical from middleEnd to bowEnd)
      const ellipseLength = bowEnd - middleEnd; // 130
      const ellipseMajorAxis = ellipseLength / 2; // 65
      const adjustedY = y - middleEnd - ellipseMajorAxis; // Center the ellipse

      return (
        Math.pow(x, 2) / Math.pow(minorAxis, 2) +
          Math.pow(adjustedY, 2) / Math.pow(ellipseMajorAxis, 2) <=
        1
      );
    }
  };

  const getShipBoundaryAtY = (y: number) => {
    const minorAxis = shipWidth / 2; // 25

    // Ship sections
    const sternEnd = -150;
    const middleEnd = 20;
    const bowEnd = 150;

    // Check Y bounds
    if (y < sternEnd || y > bowEnd) return null;

    if (y >= sternEnd && y <= middleEnd) {
      // Stern and Middle sections (rectangular - full width)
      return { left: -minorAxis, right: minorAxis };
    } else {
      // Forward section (elliptical)
      const ellipseLength = bowEnd - middleEnd; // 130
      const ellipseMajorAxis = ellipseLength / 2; // 65
      const adjustedY = y - middleEnd - ellipseMajorAxis; // Center the ellipse

      const term = 1 - Math.pow(adjustedY, 2) / Math.pow(ellipseMajorAxis, 2);

      if (term < 0) return null;

      const xBoundary = minorAxis * Math.sqrt(term);
      return { left: -xBoundary, right: xBoundary };
    }
  };

  const handleLocate = () => {
    const { x, y, z } = coordinates;

    if (z < -15) {
      setText("Person Overboard at Below Deck");
      return;
    }

    // Check if point is outside the ship - this means Man Overboard!
    if (!isInsideShip(x, y)) {
      if (y >= -150 && y <= -110) {
        // Stern section (rectangular)
        if (x < -25) {
          setText("Person Overboard at Port side stern");
        } else if (x > 25) {
          setText("Person Overboard at Starboard side stern");
        } else {
          setText("Person Overboard at Center stern");
        }
      } else if (y >= -110 && y <= 20) {
        // Middle section (rectangular)
        if (x < -25) {
          setText("Person Overboard at Port side middle");
        } else if (x > 25) {
          setText("Person Overboard at Starboard side middle");
        }
      } else if (y >= 20) {
        // Forward section (elliptical)
        const boundary = getShipBoundaryAtY(y);
        console.log("Boundary at Y =", y, "is", boundary);
        if (boundary) {
          if (x < boundary.left * 0.5) {
            setText("Person Overboard at Port side forward");
          } else if (x > boundary.right * 0.5) {
            setText("Person Overboard at Starboard side forward");
          } else {
            setText("Person Overboard at Center forward");
          }
        } else {
          setText("Person Overboard at Forwardmost point");
        }
      }

      return;
    }

    return setText(null);
  };

  return (
    <div className="App">
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
          Coordinate Locator
        </h3>
        <span>
          Ship dimensions: {shipLength}m × {shipWidth}m (elliptical)
        </span>

        <div style={{ marginBottom: "10px" }}>
          <label
            style={{
              display: "inline-block",
              width: "20px",
              fontWeight: "bold",
            }}
          >
            X:
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={coordinates.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            style={{
              width: "80px",
              padding: "5px",
              marginLeft: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label
            style={{
              display: "inline-block",
              width: "20px",
              fontWeight: "bold",
            }}
          >
            Y:
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={coordinates.y}
            onChange={(e) => handleInputChange("y", e.target.value)}
            style={{
              width: "80px",
              padding: "5px",
              marginLeft: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "inline-block",
              width: "20px",
              fontWeight: "bold",
            }}
          >
            Z:
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={coordinates.z}
            onChange={(e) => handleInputChange("z", e.target.value)}
            style={{
              width: "80px",
              padding: "5px",
              marginLeft: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleLocate}
            style={{
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Locate
          </button>
        </div>

        <div
          className={`h-[50px] flex flex-col justify-center p-2 mt-3 ${
            text ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <p className="text-white">{text}</p>
        </div>
      </div>
      <Canvas style={{ backgroundColor: "black" }}>
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera
            makeDefault
            fov={60}
            aspect={window.innerWidth / window.innerHeight}
            position={[3, 0.15, 3]}
            near={1}
            far={5000}
            position-z={600}
          ></PerspectiveCamera>
          <Editor setSelected={setSelected} />
          <directionalLight color={0xeb4634} position={[1, 0.75, 0.5]} />
          <directionalLight color={0xccccff} position={[-1, 0.75, -0.5]} />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Panel selected={selected} />
    </div>
  );
}

export default App;
