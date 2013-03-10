class CreateCalls < ActiveRecord::Migration
  def change
    create_table :calls do |t|
      t.text :callee_session
      t.text :caller_session

      t.timestamps
    end
  end
end
