import React from 'react'
import Helmet from 'react-helmet'

export default class extends React.Component {

  render() {
    return (
      <main>
        <Helmet
          title="License"
          meta={[
            {"name": "description", "content": "LWJGL is licensed under GPL"}
          ]}
        />
        <section className="container">
          <h1>Lightweight Java Gaming Library License</h1>
          <hr />

          <article className="row">
            <div className="col-lg-6 col-xs-12">
              <p>Redistribution and use in source and binary forms, with or without
                modification, are permitted provided that the following conditions are
                met:</p>

              <ul>
                <li>Redistributions of source code must retain the above copyright
                  notice, this list of conditions and the following disclaimer.
                </li>
                <li>Redistributions in binary form must reproduce the above copyright
                  notice, this list of conditions and the following disclaimer in the
                  documentation and/or other materials provided with the distribution.
                </li>
                <li>Neither the name of 'Light Weight Java Game Library' nor the names of
                  its contributors may be used to endorse or promote products derived
                  from this software without specific prior written permission.
                </li>
              </ul>
            </div>
            <div className="col-lg-6 col-xs-12">
              <p>THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
                "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
                TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
                PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
                CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
                EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
                PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
                PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
                LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
                NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
                SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</p>
            </div>
          </article>
        </section>
      </main>
    )
  }

};
