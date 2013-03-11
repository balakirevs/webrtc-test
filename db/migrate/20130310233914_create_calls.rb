class CreateCalls < ActiveRecord::Migration
  def change
    create_table :calls do |t|
      t.text :callee_session
      t.text :caller_session
      t.text :callee_ice_candidate
      t.text :caller_ice_candidate

      t.timestamps
    end
  end
end
