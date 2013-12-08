require 'test_helper'

class CabalTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
	
	def test_create_new_from_params
		param = {name: "cabal1", date: "2013-12-08"}
		nc = Cabal.creat_new_from_params(users(:one),param)
	end
end
