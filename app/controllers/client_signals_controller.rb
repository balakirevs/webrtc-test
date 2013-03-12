class ClientSignalsController < ApplicationController

  respond_to :json

  def index
    @signals = ClientSignal.where('read = 0 AND client_id != ? AND call_id = ?', params[:client_id], params[:call_id]).order('id')
    @signals.map { |s| s.update_attribute(:read, 1) }
    respond_with @signals
  end

  def create
    @signal = ClientSignal.new(
      signal_type: params[:type],
      data: params[:data],
      client_id: params[:client_id],
      call_id: params[:call_id]
    )
    @signal.save
    render text: ''
  end

end
