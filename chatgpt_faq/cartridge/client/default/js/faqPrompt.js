'use strict';

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
    chatbotBody.animate({ scrollTop: chatbotBody.height() }, 1000)
}

function getEmbeddings(query) {
    try {
        $.ajax({
            url: '/on/demandware.store/Sites-RefArch-Site/default/Azure-FAQResponse',
            method: 'post',
            data: query,
            success: function (data) {
                appendMessage(data.responseMsg, 'bot');
            },
            error: function (error) {
                console.log(error);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

function handleUserInput(evt) {
    const userMessage = evt.currentTarget.value ? evt.currentTarget.value.trim() : ''
    if (userMessage !== '') {
        appendMessage(userMessage, 'user');
        evt.currentTarget.value = '';
        getEmbeddings(userMessage)
    }
}

$('#user-input').on('keypress', function (evt) {
    if (evt.key === 'Enter') {
        handleUserInput(evt);
    }
})