(function() {
    var hostname = window.location.hostname;
    var environment;
  
    // Check if the hostname contains "localhost"
    if (hostname.includes('localhost')) {
      environment = 'local';
    }
     else if (hostname.includes('127.0.0.1')) {
      environment = 'local';
    }

    // Default to "production" if none of the above conditions match
    else {
      environment = 'production';
    }
  
    window.environment = environment;
})();
