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
  const [text, setText] = useState("");

  const handleInputChange = (axis, value) => {
    setCoordinates(prev => ({
      ...prev,
      [axis]: parseFloat(value) || 0
    }));
  };

  const handleLocate = () => {
    const { x, y, z } = coordinates;
    if (y  > 10 && x < -10) {
      setText("Man Overboard at port side forward");
    } else if (y  > 10 && x > 10) {
      setText("Man Overboard at starboard side forward");
    } else if (y > 0 && y < 5 && x < -10) {
      setText("Man Overboard at port side middle");
    } else if (y > 0 && y < 5 && x > 10) {
      setText("Man Overboard at starboard side middle");
    } else if (y < 0 && y > -5 && x < -10) {
      setText("Man Overboard at port side after");
    } else if (y < 0 && y > -5 && x > 10) {
      setText("Man Overboard at starboard side after");
    } else if (z < -20) {
      setText("Man Overboard at extreme depth");
    } else {
      setText(null);
    }
  };

  return (
    <div className="App">
      <div style={{ 
        position: "absolute", 
        top: 20, 
        left: 20, 
        zIndex: 1,
        background: "rgba(255, 255, 255, 0.9)",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Coordinate Locator</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "inline-block", width: "20px", fontWeight: "bold" }}>X:</label>
          <input 
            type="number" 
            step="0.1"
            placeholder="0.0"
            value={coordinates.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            style={{ 
              width: "80px", 
              padding: "5px", 
              marginLeft: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "inline-block", width: "20px", fontWeight: "bold" }}>Y:</label>
          <input 
            type="number" 
            step="0.1"
            placeholder="0.0"
            value={coordinates.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            style={{ 
              width: "80px", 
              padding: "5px", 
              marginLeft: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "inline-block", width: "20px", fontWeight: "bold" }}>Z:</label>
          <input 
            type="number" 
            step="0.1"
            placeholder="0.0"
            value={coordinates.z}
            onChange={(e) => handleInputChange('z', e.target.value)}
            style={{ 
              width: "80px", 
              padding: "5px", 
              marginLeft: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
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
              fontWeight: "bold"
            }}
          >
            Locate
          </button>
        </div>

        <div className={`h-[50px] flex flex-col justify-center p-2 mt-3 ${text ? 'bg-red-500' : 'bg-green-500'}`}>
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
