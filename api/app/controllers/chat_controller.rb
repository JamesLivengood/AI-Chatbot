class ChatController < ApplicationController
  def create
    message = params.require(:message)

    client = Anthropic::Client.new

    response = client.messages.create(
      model: :"claude-opus-4-7",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }]
    )

    reply = response.content.find { |b| b.type == :text }&.text

    render json: { reply: reply }
  rescue ActionController::ParameterMissing => e
    render json: { error: e.message }, status: :bad_request
  rescue Anthropic::RateLimitError
    render json: { error: "Claude rate limit reached" }, status: :too_many_requests
  rescue Anthropic::AuthenticationError
    render json: { error: "Invalid or revoked Anthropic API key" }, status: :unauthorized
  rescue Anthropic::APIError => e
    render json: { error: e.message }, status: :bad_gateway
  end
end
