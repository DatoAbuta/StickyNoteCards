import Image from "next/image";
import PlusButton from '../../imgs/button.svg';
import ColorPicker from "../ColorSelection/ColorSelection";
import DownloadBTN from '../../imgs/download.svg';

interface FooterProps {
  onColorSelect: (color: string) => void;
  opened: boolean;
  onClick: () => void;
  spin: boolean;
  onDownloadAll: () => void;
}

const Footer = ({ onColorSelect, opened, onClick, spin, onDownloadAll }: FooterProps) => {
  return (
    <footer className="flex justify-center items-center p-4 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex gap-4">
        <Image
          src={DownloadBTN}
          alt="DownloadButton"
          width={30}
          height={30}
          onClick={onDownloadAll}
        />
        <Image
          src={PlusButton}
          alt="PlusButton"
          width={50}
          height={50}
          onClick={onClick}
          className={`transition-transform ${spin ? "rotate-180" : "rotate-0"} cursor-pointer`}
        />
      </div>
      {opened && (
        <ColorPicker
          colors={["#FFFF00", "#00FF09", "#1100FF", "#FF0000"]}
          onColorSelect={onColorSelect}
        />
      )}
    </footer>
  );
};

export default Footer;
