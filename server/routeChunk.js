class RouteChunk {

  name = null;

  setName(name) {
    this.name = name === '/' ? '/' : `/${name}`;
  }

}

module.exports = new RouteChunk();