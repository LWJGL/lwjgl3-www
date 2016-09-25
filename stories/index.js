import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';
import '../public/css/layout.css'
import '../.storybook/storybook.css'

// LWJGL
import BuildStatus from '../client/components/BuildStatus';
import Copyright from '../client/components/Copyright';

// UI
import LoaderSpinner from '../client/components/LoaderSpinner';

// SVG Icons
import FaApple from '../client/icons/apple';
import FaAngleDown from '../client/icons/angle-down';
import FaBars from '../client/icons/bars';
import FaBook from '../client/icons/book';
import FaClose from '../client/icons/close';
import FaCogs from '../client/icons/cogs';
import FaComments from '../client/icons/comments';
import FaDesktop from '../client/icons/desktop';
import FaGamepad from '../client/icons/gamepad';
import FaGithub from '../client/icons/github';
import FaPuzzlePiece from '../client/icons/puzzle-piece';
import FaQuestionCircle from '../client/icons/question-circle';

const storiesLWJGL = storiesOf('lwjgl.org', module);
storiesLWJGL.addDecorator(withKnobs);
storiesLWJGL
  .addWithInfo('Copyright', () => (
    <Copyright />
  ))
  .addWithInfo('BuildStatus', () => (
    <BuildStatus name={text('name', 'LwjglReleases_NightlyToStable')} />
  ));

const storiesUI = storiesOf('UI', module);
storiesUI.addDecorator(withKnobs);
storiesUI
  .addWithInfo('LoaderSpinner', () => (
    <LoaderSpinner size={number('Size', 48)} style={{stroke:text('style.stroke', '')}} />
  ));

// SVG Icons
const storiesIcons = storiesOf('Icons', module);
storiesIcons.addDecorator(withKnobs);
storiesIcons
  .addWithInfo('apple', () => (
    <FaApple size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('angle-down', () => (
    <FaAngleDown size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('bars', () => (
    <FaBars size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('book', () => (
    <FaBook size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('close', () => (
    <FaClose size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('cogs', () => (
    <FaCogs size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('comments', () => (
    <FaComments size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('desktop', () => (
    <FaDesktop size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('gamepad', () => (
    <FaGamepad size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('github', () => (
    <FaGithub size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('puzzle-piece', () => (
    <FaPuzzlePiece size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('question-circle', () => (
    <FaQuestionCircle size={number('Size', 48)} color={text('Color', '')} />
  ));
