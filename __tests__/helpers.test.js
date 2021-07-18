const {format_date, format_plural, format_url} = require('../utils/helpers');

test('format_date() returns a date string', () => {
	const date = new Date('2020-03-20 16:12:03');

	expect(format_date(date)).toBe('3/20/2020');
});

test('format_url() returns a simplified url string', () => {
	const url1 = format_url('http://yahoo.com/page/1');
	const url2 = format_url('https://www.dimetime.com/abcdefg/');
	const url3 = format_url('https://www.brave.com?q=hello');

	expect(url1).toBe('yahoo.com');
	expect(url2).toBe('dimetime.com');
	expect(url3).toBe('brave.com');
});

test('format_plural() returns a pluralize word', () => {
	const word1 = format_plural('boy', 1);
	const word2 = format_plural('girl', 2);
	
	expect(word1).toBe('boy');
	expect(word2).toBe('girls');
});

