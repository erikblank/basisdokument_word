import * as React from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";

export interface ProgressProps {
  logo: string;
  message: string;
  title: string;
  click: () => void;
}

const Progress = ({ logo, message, title }: ProgressProps) => {
  return (
    <section className="ms-welcome__progress ms-u-fadeIn500">
      <img width="90" height="90" src={logo} alt={title} title={title} />
      <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">{title}</h1>
      <Spinner size={SpinnerSize.large} label={message} />
    </section>
  );
};

export default Progress;
