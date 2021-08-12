import { styled } from '~/theme/stitches.config';
import { PageView } from '~/routes/PageView';
import { Grid } from '~/components/layout/Grid';
import { Container } from '~/components/ui/Container';
import { Title } from '~/components/lwjgl/Title';
import { Prose } from '~/components/ui/Prose';

const ArticleContainer = styled('article', Container);

const LicenseRoute: React.FC<{ children?: never }> = () => (
  <PageView title="License" description="LWJGL is licensed under BSD">
    <ArticleContainer padding>
      <Title>Lightweight Java Game Library License</Title>
      <Grid
        css={{
          gap: '$gutter',
          '@md': { grid: 'auto-flow / 1fr 1fr' },
          '@xxl': { grid: 'auto-flow / max-content 1fr 1fr' },
        }}
      >
        <Prose
          css={{
            color: '$neutral700',
            '@md': { gridColumn: 1 },
          }}
        >
          <p>
            <small>
              Copyright © 2012-present Lightweight Java Game Library
              <br />
              All rights reserved.
            </small>
          </p>
        </Prose>
        <Prose
          css={{
            '@md': { gridRow: 2 },
            '@xxl': { gridRow: 'auto' },
          }}
        >
          <p>
            Redistribution and use in source and binary forms, with or without modification, are permitted provided that
            the following conditions are met:
          </p>

          <ol>
            <li>
              Redistributions of source code must retain the above copyright notice, this list of conditions and the
              following disclaimer.
            </li>
            <li>
              Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
              following disclaimer in the documentation and/or other materials provided with the distribution.
            </li>
            <li>
              Neither the name Lightweight Java Game Library nor the names of its contributors may be used to endorse or
              promote products derived from this software without specific prior written permission.
            </li>
          </ol>
        </Prose>
        <Prose
          css={{
            '@md': { gridRow: '1/3' },
            '@xxl': { gridRow: 'auto' },
          }}
        >
          <p>
            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
            WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
            PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
            DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
            PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
            HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
            NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGE.
          </p>
        </Prose>
      </Grid>
    </ArticleContainer>
  </PageView>
);

export default LicenseRoute;
