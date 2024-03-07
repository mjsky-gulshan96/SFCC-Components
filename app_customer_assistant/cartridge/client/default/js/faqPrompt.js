function appendMessage(message, sender) {
    const chatbotBody = $('#chatbot-body');
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    if (sender === 'user') {
        messageElement.style.textAlign = 'right';
        messageElement.style.color = '#007bff';
    } else {
        messageElement.style.textAlign = 'left';
        messageElement.style.color = '#333';
    }
    chatbotBody.append(messageElement);
    chatbotBody.animate({ scrollTop: chatbotBody[0].scrollHeight }, 1000);
}

function getEmbeddings(query) {
    try {
        $.ajax({
            url: '/on/demandware.store/Sites-RefArch-Site/default/Azure-FAQResponse',
            method: 'post',
            data: JSON.stringify({ query }),
            success: function (data) {
                if (data.error) {
                    appendMessage('Sorry, I was trying to charge my phone. What were you trying to say?', 'bot');
                } else {
                    appendMessage(data.responseMsg, 'bot');
                }
            },
            error: function (error) {
                appendMessage('some error occured at the moment. Give Me a break', 'bot');
            }
        })
    } catch (error) {
        appendMessage('some error occured at the moment. Give Me a break', 'bot');
        console.log(error);
    }
}

function handleUserInput(evt) {
    const userMessage = evt.currentTarget.value
        ? evt.currentTarget.value.trim()
        : '';
    if (userMessage !== '') {
        appendMessage(userMessage, 'user');
        evt.currentTarget.value = '';
        getEmbeddings(userMessage, false);
    }
}

$('#user-input').on('keypress', function (evt) {
    if (evt.key === 'Enter') {
        handleUserInput(evt);
    }
})
