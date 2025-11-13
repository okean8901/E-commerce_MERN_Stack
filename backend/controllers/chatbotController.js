// Chatbot controller using Azure OpenAI or any LLM API
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Placeholder chatbot response
    // In production, integrate with Azure OpenAI or other LLM service
    const responses = {
      hello: 'Xin chào! Tôi là trợ lý AI của Okean Mobile. Tôi có thể giúp bạn tìm sản phẩm, theo dõi đơn hàng, hoặc trả lời các câu hỏi về cửa hàng.',
      product: 'Chúng tôi bán điện thoại, phụ kiện, máy tính bảng và nhiều sản phẩm công nghệ khác. Bạn tìm kiếm cái gì?',
      order: 'Bạn có thể theo dõi đơn hàng trong tài khoản cá nhân hoặc liên hệ đội hỗ trợ khách hàng.',
      payment: 'Chúng tôi chấp nhận thanh toán bằng tiền mặt khi nhận hàng (COD) và thanh toán trực tuyến qua VNPay.',
      default: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng hỏi một cách khác.'
    };

    const lowerMessage = message.toLowerCase();
    let reply = responses.default;

    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello')) {
      reply = responses.hello;
    } else if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product')) {
      reply = responses.product;
    } else if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('order')) {
      reply = responses.order;
    } else if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
      reply = responses.payment;
    }

    res.json({
      message: reply,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

// Get common questions
export const getCommonQuestions = async (req, res) => {
  try {
    const questions = [
      {
        question: 'Làm cách nào để đặt hàng?',
        answer: 'Bạn có thể chọn sản phẩm, thêm vào giỏ hàng, và thực hiện thanh toán.'
      },
      {
        question: 'Thời gian giao hàng là bao lâu?',
        answer: 'Thời gian giao hàng thường từ 2-5 ngày tùy vào địa chỉ giao hàng.'
      },
      {
        question: 'Chính sách hoàn trả là gì?',
        answer: 'Chúng tôi chấp nhận hoàn trả trong vòng 30 ngày nếu sản phẩm chưa được sử dụng.'
      },
      {
        question: 'Tôi có thể hủy đơn hàng không?',
        answer: 'Bạn có thể hủy đơn hàng ở trạng thái Chờ xử lý hoặc Đã xác nhận.'
      }
    ];

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi: ' + error.message });
  }
};

export default {
  sendMessage,
  getCommonQuestions
};
