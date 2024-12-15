var OPENAI_API_KEY = ""; // Thay thế bằng API Key của bạn

$(document).ready(function () {
    $('#sendButton').click(function () {
        sendMessage();
    });

    $('#userInput').keypress(function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        var userInput = $('#userInput').val().trim();
        if (userInput === "") {
            alert("Vui lòng nhập câu hỏi!");
            return;
        }

        // Nhắn tin
        appendMessage('user', userInput); // Hiển thị tin nhắn của người dùng
        $('#userInput').val(''); // Xóa nội dung input

        // Hiển thị thông báo đang tải
        var loadingMessageId = appendMessage('Tùng', "Đang tạo hình ảnh... Vui lòng đợi.");

        // Tạo ảnh 
        $.ajax({
            url: "https://api.openai.com/v1/images/generations",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                prompt: userInput, // Prompt mô tả hình ảnh cần tạo
                n: 1,              // Số lượng hình ảnh cần tạo
                size: "256x256"  // Kích thước của hình ảnh (256x256, 512x512, hoặc 1024x1024)
            }),
            
            success: function (response) {
                var imageUrl = response.data[0].url;
                appendMessage('bot', `<img src="${imageUrl}" alt="Generated Image" style="max-width:100%;">`);
            },
            
            error: function (xhr, status, error) {
                console.error("Lỗi:", error);
                appendMessage('bot', "Xin lỗi, đã xảy ra lỗi khi tạo hình ảnh.");
            }
        });
        
        // Gửi API ChatGPT trò chuyện
        // $.ajax({
        //     url: "https://api.openai.com/v1/chat/completions",
        //     method: "POST",
        //     headers: {
        //         "Authorization": "Bearer " + OPENAI_API_KEY,
        //         "Content-Type": "application/json"
        //     },
        //     data: JSON.stringify({
        //         model: "gpt-3.5-turbo",
        //         messages: [
        //             { role: "user", content: userInput }
        //         ],
        //         max_tokens: 512,
        //         temperature: 0.5
        //     }),
            
        //     success: function (response) {
        //         var botResponse = response.choices[0].message.content.trim();
        //         appendMessage('bot', botResponse);
        //     },
            
        //     error: function (xhr, status, error) {
        //         console.error("Lỗi:", error);
        //         appendMessage('bot', "Xin lỗi, đã xảy ra lỗi khi gửi yêu cầu.");
        //     }
        // });
    }

    function appendMessage(sender, message) {
        var messageClass = sender === 'user' ? 'text-right' : 'text-left';
        var messageHtml = `
            <div class="chat-message ${sender} ${messageClass}">
                <div class="message">${message}</div>
            </div>
        `;
        $('#chatBox').append(messageHtml);
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    }
});
