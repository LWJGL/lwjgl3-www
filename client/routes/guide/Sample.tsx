import { ResourceCached } from '~/services/Resource';
import { HTTP_OK } from '~/services/http_status_codes';
import { useCSS } from '~/hooks/useCSS';

const SampleResource = new ResourceCached<void, string>(async () => {
  const response = await fetch('/sample.html');
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.text();
});

export const Sample: React.FC<{ children?: never }> = () => {
  const sample = SampleResource.read();
  useCSS('https://unpkg.com/highlight.js@10.0.3/styles/dracula.css');

  return (
    <pre className="container" style={{ color: 'white', tabSize: 4 }}>
      <code className="java" dangerouslySetInnerHTML={{ __html: sample }}></code>
    </pre>
  );
};
