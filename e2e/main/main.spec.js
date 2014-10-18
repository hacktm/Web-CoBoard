'use strict';

describe('Main View', function() {
  
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should show text near the logo', function() {
    
    expect(page.logo.getText()).toBe('Wall Songs - Songs that you love');

    expect(page.content.getText()).toBe('index.main');
    
  });
});
