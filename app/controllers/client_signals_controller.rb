class ClientSignalsController < ApplicationController

  respond_to :json

  def index
    @signals = ClientSignal.where(read: 0).order('id DESC')
    @signals.map { |s| s.update_attribute(:read, 1) }
    respond_with @signals
  end

  def create
    @signal = ClientSignal.new(
      signal_type: params[:type],
      data: params[:data]
    )
    @signal.save
    render text: ''
  end

end
