
import { runFile, insp } from '../../helpers/testsHelper';

/**
 * Тестируем поддержку скобок
 * См. задачу:
 * @see https://fkn.ktu10.com/?q=node/16472
 * 
 */

let pjs = runFile(import.meta.url, 'parentheses.code');

test('result = 80', () => {
  expect(pjs.engine.results[0]).toBe(80);
});

test('result = 80', () => {
    expect(pjs.engine.results[1]).toBe(80);
  });

  test('result = 4', () => {
    expect(pjs.engine.results[2]).toBe(4);
  });

  test('result = -3', () => {
    expect(pjs.engine.results[3]).toBe(-3);
  });

  test('result = 5', () => {
    expect(pjs.engine.results[4]).toBe(5);
  });

  test('result = 29', () => {
    expect(pjs.engine.results[5]).toBe(29);
  });

  test('result = 15', () => {
    expect(pjs.engine.results[6]).toBe(15);
  });

  test('result = 16', () => {
    expect(pjs.engine.results[7]).toBe(16);
  });

  test('result = 4', () => {
    expect(pjs.engine.results[8]).toBe(4);
  });

  test('result = -3', () => {
    expect(pjs.engine.results[9]).toBe(-3);
  });

  test('result = -15', () => {
    expect(pjs.engine.results[10]).toBe(-15);
  });

