'use strict';

/**
 * Dependencies.
 */

var Retext,
    metaphone,
    stemmer,
    inspect,
    visit,
    content,
    assert;

Retext = require('retext');
metaphone = require('./');
stemmer = require('retext-porter-stemmer');
inspect = require('retext-inspect');
visit = require('retext-visit');
content = require('retext-content');
assert = require('assert');

/**
 * Retext.
 */

var retext,
    retextWithStemmer;

retext = new Retext()
    .use(inspect)
    .use(content)
    .use(visit)
    .use(metaphone);

retextWithStemmer = new Retext()
    .use(inspect)
    .use(content)
    .use(visit)
    .use(metaphone)
    .use(stemmer);

/**
 * Fixtures.
 */

var sentence,
    otherWords,
    otherPhonetics,
    stemmedOtherPhonetics;

sentence = 'A simple, english, sentence';
otherWords = ['A', 'detestable', 'vile', 'paragraph'];
otherPhonetics = ['A', 'TTSTBL', 'FL', 'PRKRF'];
stemmedOtherPhonetics = ['A', 'TTST', 'FL', 'PRKRF'];

/**
 * Tests.
 */

describe('metaphone()', function () {
    it('should be of type `function`', function () {
        assert(typeof metaphone === 'function');
    });

    retext.parse(sentence, function (err, tree) {
        it('should not throw', function (done) {
            done(err);
        });

        it('should process each `WordNode`', function () {
            tree.visit(tree.WORD_NODE, function (wordNode) {
                assert('phonetics' in wordNode.data);
            });
        });

        it('should set `phonetics` to `null` when `WordNode` (no ' +
            'longer?) has a value',
            function () {
                tree.visit(tree.WORD_NODE, function (wordNode) {
                    wordNode.removeContent();

                    assert(wordNode.data.phonetics === null);
                });
            }
        );

        it('should re-process `WordNode`s when their values change',
            function () {
                var index;

                index = -1;

                tree.visit(tree.WORD_NODE, function (wordNode) {
                    index++;

                    wordNode.replaceContent(otherWords[index]);

                    assert(wordNode.data.phonetics === otherPhonetics[index]);
                });
            }
        );
    });
});

describe('metaphone() with a stemmer', function () {
    retextWithStemmer.parse(sentence, function (err, tree) {
        it('should not throw', function (done) {
            done(err);
        });

        it('should process `stem` in each `WordNode`', function () {
            tree.visit(tree.WORD_NODE, function (wordNode) {
                assert('stemmedPhonetics' in wordNode.data);
            });
        });

        it('should set `stemmedPhonetics` to `null` when `WordNode` (no ' +
            'longer?) has a value',
            function () {
                tree.visit(tree.WORD_NODE, function (wordNode) {
                    wordNode.removeContent();

                    assert(wordNode.data.stemmedPhonetics === null);
                });
            }
        );

        it('should re-process `WordNode`s when their stem changes',
            function () {
                var index;

                index = -1;

                tree.visit(tree.WORD_NODE, function (wordNode) {
                    index++;

                    wordNode.replaceContent(otherWords[index]);

                    assert(
                        wordNode.data.stemmedPhonetics ===
                        stemmedOtherPhonetics[index]
                    );
                });
            }
        );
    });
});
