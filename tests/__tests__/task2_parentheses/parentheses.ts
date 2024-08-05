
import { runFile, insp } from '../../helpers/testsHelper';

/**
 * Тестируем поддержку скобок
 * См. задачу:
 * @see https://fkn.ktu10.com/?q=node/16472
 * 
 */

let pjs = runFile(import.meta.url, 'parentheses.code');

test('result = 5', () => {
  expect(pjs.engine.results[0]).toBe(5);
});

test('result = 80', () => {
    expect(pjs.engine.results[1]).toBe(80);
  });

  test('result = 4', () => {
    expect(pjs.engine.results[2]).toBe(4);
  });
