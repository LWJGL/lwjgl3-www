import { PageView } from '~/components/routes/PageView';

export default function FrameworksRoute() {
  return (
    <PageView title="Frameworks" description="LWJ">
      <FrameworksStatic />
    </PageView>
  );
}

const FrameworksStatic = () => (
  <section className="container">
    <h1>
      Frameworks & Game Engines using LW
      <b>JGL</b>
    </h1>
    <hr />

    <h2 className="mt-5">
      <img className="img-fluid" src="/img/showcase/libGDX.png" alt="libGDX" width="300" height="50" />
    </h2>
    <p>
      <a href="https://libgdx.badlogicgames.com/">https://libgdx.badlogicgames.com/</a>
    </p>
    <p>
      libGDX is a cross-platform Java game development framework based on OpenGL (ES) that works on Windows, Linux, Mac
      OS X, Android, your WebGL enabled browser and iOS.
    </p>

    <h2 className="mt-5">
      <img className="img-fluid" src="/img/showcase/jmonkeyengine.png" alt="jMonkeyEngine" width="340" height="60" />
    </h2>
    <p>
      <a href="https://jmonkeyengine.org/">https://jmonkeyengine.org/</a>
    </p>
    <p>
      jMonkeyEngine is a 3-D game engine for adventurous Java developers. It’s open-source, cross-platform, and
      cutting-edge.
    </p>
    <p>The engine is used by several commercial game studios and computer-science courses.</p>
  </section>
);
