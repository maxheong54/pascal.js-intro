
import { runFile, insp } from '../../helpers/testsHelper';

/**
 * Тестируем поддержку перменных
 * См. задачу:
 * @see https://fkn.ktu10.com/?q=node/16473
 * 
 */

let pjs = runFile(import.meta.url, 'variables.code');

test('result = 8', () => {
  expect(pjs.engine.results[0]).toBe(8);
});

test('result = 11', () => {
    expect(pjs.engine.results[1]).toBe(11);
  });

test('result = 11', () => {
    expect(pjs.engine.results[2]).toBe(11);
  });

test('result = 3', () => {
    expect(pjs.engine.results[3]).toBe(3);
});

test('result = 15', () => {
    expect(pjs.engine.results[4]).toBe(15);
});

test('result = 28', () => {
  expect(pjs.engine.results[5]).toBe(28);
});

test('result = 28', () => {
  expect(pjs.engine.results[6]).toBe(28);
});

test('result = 35', () => {
  expect(pjs.engine.results[7]).toBe(35);
});

test('result = 9', () => {
  expect(pjs.engine.results[8]).toBe(9);
});

test('result = 35', () => {
  expect(pjs.engine.results[9]).toBe(35);
});

test('result = 15', () => {
  expect(pjs.engine.results[10]).toBe(15);
});

test('result = 15', () => {
  expect(pjs.engine.results[11]).toBe(15);
});

test('result = 9', () => {
  expect(pjs.engine.results[12]).toBe(9);
});

test('result = 9', () => {
  expect(pjs.engine.results[13]).toBe(9);
});

test('result = 9', () => {
  expect(pjs.engine.results[14]).toBe(9);
});
