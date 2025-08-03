lucide.createIcons();

$('#current-year').text(new Date().getFullYear());

setTimeout(function () {
  $('#header').addClass('active');
  setTimeout(function () {
    $('#card-container').addClass('active');
  }, 100);
}, 100);

$('#validation-form').on('submit', function (e) {
  e.preventDefault();

  const gameId = $('#gameId').val();
  const serverId = $('#serverId').val();

  if (!gameId || !serverId) {
    showError('Please enter both User ID and Server ID');
    return;
  }

  const originalButtonText = $('#submit-button').html();
  $('#submit-button').html(
    '<div class="flex items-center justify-center"><i data-lucide="loader-2" class="mr-2 h-4 w-4 animate-spin"></i><span>Checking...</span></div>'
  );
  $('#submit-button').prop('disabled', true);
  lucide.createIcons();

  $('#error-container').addClass('hidden');
  $('#result-container').addClass('hidden');

  $.ajax({
    url: '/api/validate',
    type: 'GET',
    data: {
      id: gameId,
      serverid: serverId
    },
    dataType: 'json',
    success: function (data) {
      if (data.status === 'success') {
        showResult(data.result);
      } else {
        showError(data.message || 'Failed to validate account');
      }
    },
    error: function (xhr) {
      let errorMessage = 'Error connecting to the server';
      try {
        const response = JSON.parse(xhr.responseText);
        if (response && response.message) {
          errorMessage = response.message;
        }
      } catch (e) {}
      showError(errorMessage);
    },
    complete: function () {
      $('#submit-button').html(originalButtonText);
      $('#submit-button').prop('disabled', false);
    }
  });
});

function showError(message) {
  $('#error-message').text(message);
  $('#error-container').removeClass('hidden');
  $('#error-container').css({ opacity: '0', transform: 'translateY(5px)' });
  setTimeout(function () {
    $('#error-container').css({ opacity: '1', transform: 'translateY(0)' });
  }, 10);
}

function showResult(result) {
  $('#result-nickname').text(result.nickname);
  $('#result-country').text(result.country);
  $('#result-container').removeClass('hidden');
  $('#result-container').css({ opacity: '0', transform: 'translateY(5px)' });
  setTimeout(function () {
    $('#result-container').css({ opacity: '1', transform: 'translateY(0)' });
  }, 10);
}
