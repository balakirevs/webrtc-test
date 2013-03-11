class ClientSignalsController < ApplicationController

  respond_to :json

  def index
    @signals = ClientSignal.where(read: 0).order('id DESC')
    @signals.map { |s| s.update_attribute(read: 1) }
  end

  def create
    @signal = ClientSignal.new(
      type: params[:type],
      data: params[:data]
    )
    @signal.save
  end

end
