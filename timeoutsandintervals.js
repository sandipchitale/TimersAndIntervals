// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
(function() {
  chrome.devtools.panels.sources.createSidebarPane('Timeouts and Intervals (milliseconds)',
    function (sidebar) {
      sidebar.setHeight('50em');
      sidebar.setPage('ti.html');
    });
})();
