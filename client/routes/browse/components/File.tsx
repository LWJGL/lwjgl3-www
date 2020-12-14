import { Row } from './Row';

interface Props {
  path: string;
}

export const File = ({ path }: Props) => {
  const url = `https://build.lwjgl.org/${path}`;

  return (
    <Row>
      {path.split('/').pop()}
      <br />
      <a download={true} href={url}>
        <small>{url}</small>
      </a>
    </Row>
  );
};
