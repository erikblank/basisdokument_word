import React from "react";
import { Button, ButtonProps } from "../../Button";

interface WFButtonProps extends ButtonProps {
  label: string;
}

const WFButton = ({ label, ...rest }: WFButtonProps) => {
  return (
    <Button {...rest} bgColor="bg-darkGrey hover:bg-darkGrey/60" textColor="text-white" size="sm">
      {label}
    </Button>
  );
};

export default WFButton;
