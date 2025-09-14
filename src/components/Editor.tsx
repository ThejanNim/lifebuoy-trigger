import { FC, Suspense, useRef } from "react";
import { Center, Select } from "@react-three/drei";
import Stls from "./Stls";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import Loader from "./Loader";

const files = ["Carnival_Spirit_1-300_scale"];
const color = ["#ffffffff"];
const opacity = [1, 1, 1];

interface Props {
  setSelected: any;
}

const Editor: FC<Props> = ({ setSelected }) => {
  const stl = useLoader(STLLoader, ["Carnival_Spirit_1-300_scale.stl"]);
  const group = useRef<any>(null!);

  return (
    <Suspense fallback={<Loader />}>
      <Center>
        <Select onChange={setSelected}>
          <group rotation={[-Math.PI / 2, 0, 0]} ref={group}>
            {stl.map((stl, idx) => (
              <Stls
                key={idx}
                opacity={opacity[idx]}
                organName={files[idx]}
                stl={stl}
                color={color[idx]}
              />
            ))}
          </group>
        </Select>
      </Center>
    </Suspense>
  );
};

export default Editor;