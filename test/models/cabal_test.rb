require 'test_helper'

class CabalTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
	
	def test_create_new_from_params_simple
		param = {name: "cabal1", date: "2013-12-08"}
		nc = Cabal.create_new_from_params(users(:one),param)
		assert_equal "cabal1", nc.cabal_name
		assert_equal Date.new(2013,12,8), nc.activity_date
		assert nc.users.include?(users(:one))
	end
	
	def test_create_new_from_params_one_user_invited
		param = {name: "cabal1", date: "2013-12-08", members: "chongyuan"}
		nc = Cabal.create_new_from_params(users(:one),param)
		assert_equal "cabal1", nc.cabal_name
		assert_equal Date.new(2013,12,8), nc.activity_date
		assert nc.users.include?(users(:one))
		assert nc.users.include?(users(:two))
	end
	
	def test_create_new_from_params_two_users_invited
		param = {name: "cabal1", date: "2013-12-08", members: "chongyuan,lucy"}
		nc = Cabal.create_new_from_params(users(:one),param)
		assert_equal "cabal1", nc.cabal_name
		assert_equal Date.new(2013,12,8), nc.activity_date
		assert nc.users.include?(users(:one))
		assert nc.users.include?(users(:two))
		assert nc.users.include?(users(:three))
	end
	
	def test_add_member
		cb = cabals(:one)
		refute cb.users.include?(users(:one))
		result0 = cb.add_member("ne")
		assert_equal 0, cb.users.length
		assert_equal 0, result0
		result1 = cb.add_member("yang")
		assert_equal 1, cb.users.length
		assert_equal 1, result1
		assert cb.users.include?(users(:one))
		result2 = cb.add_member("yang")
		assert_equal 1, cb.users.length
		assert_equal -1, result2
		assert cb.users.include?(users(:one))
		result3 = cb.add_member("chongyuan")
		assert_equal 2, cb.users.length
		assert_equal 1, result3
		assert cb.users.include?(users(:two))
	end
	
	def test_remove_user
		cb0 = cabals(:three)
		refute cb0.users.include?(users(:five))
		result0 = cb0.remove_member(users(:five))
		assert_equal 0, result0
		assert cb0.users.include?(users(:one))
		result1 = cb0.remove_member(users(:one))
		assert_equal 1, result1
		refute cb0.users.include?(users(:one))
		assert cb0.users.include?(users(:two))
		result2 = cb0.remove_member(users(:two))
		assert_equal -1, result2
		refute cb0.users.include?(users(:two))
	end
	
	def test_name
		cb0 = cabals(:one)
		assert_equal "empty_cabal", cb0.name
		cb1 = cabals(:five)
		assert_equal "Nameless Cabal", cb1.name
	end
	
	def test_members_summary
		cb0 = cabals(:two)
		assert_equal "yang ", cb0.members_summary
		cb1 = cabals(:three)
		assert_equal "yang chongyuan ", cb1.members_summary
		cb2 = cabals(:four)
		assert_equal "yang chongyuan lucy and 1 more", cb2.members_summary
	end
		
		
	
	
end
