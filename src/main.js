/**
 * Main include for talk scripts
 *
 * @package: solidity-intro-slides
 * @author:  Sam Pospischil <sam@changegiving.com>
 * @since:   2016-06-27
 */

import polyfills from 'remark/src/polyfills';
import Remark from 'remark/src/remark/api';
import RemarkHighlighter from 'remark/src/remark/highlighter';
import styler from 'remark/src/remark/components/styler/styler';

import extendHighlighter from './highlighter-extensions';
import pageContent from '../solidity-notes.md';


polyfills.apply();
extendHighlighter(RemarkHighlighter);
styler.styleDocument();

const remark = new Remark();

const slideshow = remark.create({
    source: pageContent,
    ratio: '16:9',
    highlightLanguage: 'solidity',
    highlightStyle: 'solarized-light',
    highlightInlineCode: true,
});

export default slideshow;
