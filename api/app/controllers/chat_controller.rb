class ChatController < ApplicationController
  def create
    message = params.require(:message)

    client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

    response = client.chat(
      parameters: {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      }
    )

    reply = response.dig("choices", 0, "message", "content")

    render json: { reply: reply }
  rescue ActionController::ParameterMissing => e
    render json: { error: e.message }, status: :bad_request
  rescue OpenAI::Error => e
    render json: { error: e.message }, status: :bad_gateway
  end
end
