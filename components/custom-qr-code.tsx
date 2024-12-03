import React, { FC } from "react";
import { QRCodeSVG } from "qrcode.react";

interface CustomQRCodeProps {
  value: string;
  [key: string]: any;
}

const CustomQRCode: FC<CustomQRCodeProps> = ({ value, ...props }) => {
  return <QRCodeSVG value={value} {...props} />;
};

export default CustomQRCode;
