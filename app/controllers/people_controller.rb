class PeopleController < ApplicationController

  def new
    @person = Person.new
  end

  def create
    @person = Person.new(params[:person])
    if @user.save
      redirect_to action: :show
    else
      render action: :new
    end
  end

  def show
    @person = Person.find(params[:id])
  end

end
