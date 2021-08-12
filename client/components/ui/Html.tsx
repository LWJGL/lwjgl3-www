interface Props {
  source: string;
  tag?: string;
}

export const Html: React.FC<Props> = ({ tag: Container = 'div', source, children, ...rest }) => (
  //@ts-expect-error
  <Container {...rest} dangerouslySetInnerHTML={{ __html: source }} />
);
