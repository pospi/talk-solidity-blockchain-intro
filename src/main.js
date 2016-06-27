/**
 * Main include for talk scripts
 *
 * @package: solidity-intro-slides
 * @author:  Sam Pospischil <sam@changegiving.com>
 * @since:   2016-06-27
 */

import polyfills from 'remark/src/polyfills';
import Remark from 'remark/src/remark/api';
import styler from 'remark/src/remark/components/styler/styler';

import pageContent from '../solidity-notes.md';

polyfills.apply();
styler.styleDocument();
const remark = new Remark();

const slideshow = remark.create({
    source: pageContent,
});

export default slideshow;
