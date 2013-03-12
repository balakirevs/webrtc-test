class CreateCalls < ActiveRecord::Migration
  def change
    create_table :calls do |t|
      t.integer :status, default: 0
      t.integer :caller_id
      t.integer :callee_id

      t.timestamps
    end
  end
end
