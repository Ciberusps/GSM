import React from "react";
import styled from "styled-components";

type TProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const Text = (props: TProps) => {
  const { children, ...restProps } = props;
  return <Container {...restProps}>{children}</Container>;
};

export default Text;

const Container = styled.div`
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.white};
`;
