import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Trophy,
  LayoutDashboard,
  BarChart3,
  Utensils,
  Package,
  ChevronDown,
  Coins,
  LogOut,
  Menu,
  X,
  Search,
  Heart,
  Users,
  House,
  LogIn,
  UserPlus,
} from "lucide-react";

import { logout } from "../redux/slices/authSlice";
import { fetchMyRewards } from "../redux/slices/rewardSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);

  // Reward data
  const { myRewards } = useSelector((state) => state.rewards);

  const [menuOpen, setMenuOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  // =====================================================
  // FETCH REWARDS
  // =====================================================

  useEffect(() => {
    if (token && user?.role === "donor") {
      dispatch(fetchMyRewards());
    }
  }, [dispatch, token, user]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    setDonationOpen(false);
    navigate("/login");
  };

  // =====================================================
  // DASHBOARD PATH
  // =====================================================

  const getDashboardPath = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard";
    }

    if (user?.role === "ngo" || user?.role === "volunteer") {
      return "/ngo/dashboard";
    }

    return "/donor/dashboard";
  };

  // =====================================================
  // DESKTOP NAV ITEM
  // =====================================================

  const navLinkClass = `
    group
    relative
    flex
    items-center
    gap-2
    px-3.5
    py-2.5
    rounded-xl
    text-[14px]
    font-semibold
    text-slate-600
    whitespace-nowrap
    transition-all
    duration-200
    hover:text-emerald-700
    hover:bg-emerald-50
  `;

  // =====================================================
  // MOBILE NAV ITEM
  // =====================================================

  const mobileLinkClass = `
    flex
    items-center
    gap-3
    w-full
    px-4
    py-3
    rounded-xl
    text-[15px]
    font-semibold
    text-slate-700
    transition-all
    duration-200
    hover:bg-emerald-50
    hover:text-emerald-700
  `;

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        h-[76px]
        bg-white
        border-b
        border-slate-200
        shadow-[0_2px_14px_rgba(15,23,42,0.04)]
      "
    >
      <div className="max-w-[1500px] mx-auto h-full px-5 sm:px-6 lg:px-8">
        {/* =================================================
            MAIN NAVBAR
        ================================================= */}

        <div className="h-full flex items-center justify-between">
          {/* =================================================
              LEFT SIDE - LOGO
          ================================================= */}

          <Link
            to="/"
            className="
              group
              flex
              items-center
              gap-3
              shrink-0
            "
          >
            {/* LOGO */}

            <div
              className="
                relative
                w-11
                h-11
                rounded-full
                bg-emerald-50
                border
                border-emerald-200
                flex
                items-center
                justify-center
                shadow-sm
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:shadow-[0_5px_20px_rgba(16,185,129,0.18)]
              "
            >
              <img
                src="/logo.svg"
                alt="Food Bridge"
                className="w-8 h-8 object-contain"
              />
            </div>

            {/* BRAND NAME */}

            <div className="leading-none">
              <h1
                className="
                  text-[26px]
                  font-black
                  tracking-[-0.055em]
                  text-slate-900
                "
              >
                Food
                <span className="text-emerald-600">Bridge</span>
              </h1>

              <p
                className="
                  mt-1
                  text-[8px]
                  font-bold
                  tracking-[0.22em]
                  uppercase
                  text-emerald-600/70
                "
              >
                Smart Food Donation
              </p>
            </div>
          </Link>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center">
            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden lg:flex items-center gap-1">
              {!token ? (
                <>
                  {/* =================================================
                      LEADERBOARD
                  ================================================= */}

                  <Link to="/leaderboard" className={navLinkClass}>
                    <Trophy size={17} strokeWidth={2.2} />

                    <span>Leaderboard</span>

                    <span
                      className="
                        absolute
                        bottom-1
                        left-3.5
                        right-3.5
                        h-[2px]
                        rounded-full
                        bg-emerald-500
                        origin-left
                        scale-x-0
                        transition-transform
                        duration-200
                        group-hover:scale-x-100
                      "
                    />
                  </Link>

                  {/* =================================================
                      HOME
                  ================================================= */}

                  <Link to="/" className={navLinkClass}>
                    <House size={17} strokeWidth={2.2} />

                    <span>Home</span>

                    <span
                      className="
                        absolute
                        bottom-1
                        left-3.5
                        right-3.5
                        h-[2px]
                        rounded-full
                        bg-emerald-500
                        origin-left
                        scale-x-0
                        transition-transform
                        duration-200
                        group-hover:scale-x-100
                      "
                    />
                  </Link>

                  {/* =================================================
                      LOGIN
                  ================================================= */}

                  <Link to="/login" className={navLinkClass}>
                    <LogIn size={17} strokeWidth={2.2} />

                    <span>Login</span>
                  </Link>

                  {/* =================================================
                      REGISTER
                  ================================================= */}

                  <Link
                    to="/register"
                    className="
                      ml-2
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-xl
                      bg-emerald-600
                      text-white
                      text-sm
                      font-bold
                      shadow-[0_5px_18px_rgba(16,185,129,0.18)]
                      transition-all
                      duration-200
                      hover:bg-emerald-700
                      hover:-translate-y-[1px]
                    "
                  >
                    <UserPlus size={17} />
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {/* =================================================
                      LEADERBOARD
                      IMPORTANT: SEPARATE FROM ANALYTICS
                  ================================================= */}

                  <Link to="/leaderboard" className={navLinkClass}>
                    <Trophy size={17} strokeWidth={2.2} />

                    <span>Leaderboard</span>

                    <span
                      className="
                        absolute
                        bottom-1
                        left-3.5
                        right-3.5
                        h-[2px]
                        rounded-full
                        bg-emerald-500
                        origin-left
                        scale-x-0
                        transition-transform
                        duration-200
                        group-hover:scale-x-100
                      "
                    />
                  </Link>

                  {/* =================================================
                      DASHBOARD
                  ================================================= */}

                  <Link to={getDashboardPath()} className={navLinkClass}>
                    <LayoutDashboard size={17} strokeWidth={2.2} />

                    <span>Dashboard</span>

                    <span
                      className="
                        absolute
                        bottom-1
                        left-3.5
                        right-3.5
                        h-[2px]
                        rounded-full
                        bg-emerald-500
                        origin-left
                        scale-x-0
                        transition-transform
                        duration-200
                        group-hover:scale-x-100
                      "
                    />
                  </Link>

                  {/* =================================================
                      ANALYTICS
                  ================================================= */}

                  <Link to="/analytics" className={navLinkClass}>
                    <BarChart3 size={17} strokeWidth={2.2} />

                    <span>Analytics</span>

                    <span
                      className="
                        absolute
                        bottom-1
                        left-3.5
                        right-3.5
                        h-[2px]
                        rounded-full
                        bg-emerald-500
                        origin-left
                        scale-x-0
                        transition-transform
                        duration-200
                        group-hover:scale-x-100
                      "
                    />
                  </Link>

                  {/* =================================================
                      DONATIONS DROPDOWN
                      DONOR ONLY
                  ================================================= */}

                  {user?.role === "donor" && (
                    <div
                      className="relative"
                      onMouseEnter={() => setDonationOpen(true)}
                      onMouseLeave={() => setDonationOpen(false)}
                    >
                      {/* DONATIONS BUTTON */}

                      <button
                        type="button"
                        className="
                          group
                          flex
                          items-center
                          gap-2
                          px-3.5
                          py-2.5
                          rounded-xl
                          text-[14px]
                          font-semibold
                          text-slate-600
                          whitespace-nowrap
                          transition-all
                          duration-200
                          hover:text-emerald-700
                          hover:bg-emerald-50
                        "
                      >
                        <Utensils size={17} strokeWidth={2.2} />

                        <span>Donations</span>

                        <ChevronDown
                          size={14}
                          strokeWidth={2.3}
                          className={`
                            transition-transform
                            duration-200
                            ${donationOpen ? "rotate-180" : ""}
                          `}
                        />
                      </button>

                      {/* =================================================
                          DROPDOWN
                      ================================================= */}

                      <div
                        className={`
                          absolute
                          top-full
                          left-1/2
                          -translate-x-1/2
                          pt-2
                          transition-all
                          duration-200
                          ${
                            donationOpen
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-2"
                          }
                        `}
                      >
                        <div
                          className="
                            w-[230px]
                            p-2
                            rounded-2xl
                            bg-white
                            border
                            border-slate-200
                            shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                          "
                        >
                          {/* CREATE DONATION */}

                          <Link
                            to="/donor/create-donation"
                            className="
                              flex
                              items-center
                              gap-3
                              px-3
                              py-3
                              rounded-xl
                              transition-all
                              duration-200
                              hover:bg-emerald-50
                              group
                            "
                          >
                            <div
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-emerald-50
                                text-emerald-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                                transition-colors
                                group-hover:bg-emerald-100
                              "
                            >
                              <Utensils size={17} />
                            </div>

                            <div>
                              <p
                                className="
                                  text-sm
                                  font-bold
                                  text-slate-800
                                  group-hover:text-emerald-700
                                "
                              >
                                Create Donation
                              </p>

                              <p
                                className="
                                  text-[11px]
                                  text-slate-400
                                  mt-0.5
                                "
                              >
                                Share surplus food
                              </p>
                            </div>
                          </Link>

                          {/* MY DONATIONS */}

                          <Link
                            to="/donor/my-donations"
                            className="
                              flex
                              items-center
                              gap-3
                              px-3
                              py-3
                              rounded-xl
                              transition-all
                              duration-200
                              hover:bg-emerald-50
                              group
                            "
                          >
                            <div
                              className="
                                w-9
                                h-9
                                rounded-lg
                                bg-slate-100
                                text-slate-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                                transition-all
                                group-hover:bg-emerald-100
                                group-hover:text-emerald-600
                              "
                            >
                              <Package size={17} />
                            </div>

                            <div>
                              <p
                                className="
                                  text-sm
                                  font-bold
                                  text-slate-800
                                  group-hover:text-emerald-700
                                "
                              >
                                My Donations
                              </p>

                              <p
                                className="
                                  text-[11px]
                                  text-slate-400
                                  mt-0.5
                                "
                              >
                                View your donations
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      NGO / VOLUNTEER
                  ================================================= */}

                  {(user?.role === "ngo" || user?.role === "volunteer") && (
                    <>
                      <Link
                        to="/ngo/available-donations"
                        className={navLinkClass}
                      >
                        <Search size={17} strokeWidth={2.2} />

                        <span>Available</span>
                      </Link>

                      <Link to="/ngo/my-claims" className={navLinkClass}>
                        <Heart size={17} strokeWidth={2.2} />

                        <span>My Claims</span>
                      </Link>
                    </>
                  )}

                  {/* =================================================
                      ADMIN
                  ================================================= */}

                  {user?.role === "admin" && (
                    <>
                      <Link to="/admin/users" className={navLinkClass}>
                        <Users size={17} strokeWidth={2.2} />

                        <span>Users</span>
                      </Link>

                      <Link to="/admin/donations" className={navLinkClass}>
                        <Package size={17} strokeWidth={2.2} />

                        <span>Donations</span>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* =================================================
                RIGHT USER SECTION
            ================================================= */}

            {token && (
              <div
                className="
                  hidden
                  lg:flex
                  items-center
                  ml-5
                  pl-5
                  border-l
                  border-slate-200
                  gap-4
                "
              >
                {/* =================================================
                    REWARDS
                ================================================= */}

                {user?.role === "donor" && (
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-xl
                      bg-emerald-50
                      border
                      border-emerald-200
                      shadow-sm
                    "
                  >
                    <Coins
                      size={16}
                      strokeWidth={2.2}
                      className="text-emerald-600"
                    />

                    <span
                      className="
                        text-xs
                        font-bold
                        text-emerald-800
                      "
                    >
                      {myRewards?.coins || 0}
                    </span>

                    <span
                      className="
                        px-1.5
                        py-0.5
                        rounded-md
                        bg-emerald-600
                        text-white
                        text-[9px]
                        font-black
                        uppercase
                        tracking-wide
                      "
                    >
                      {myRewards?.badge || "Bronze"}
                    </span>
                  </div>
                )}

                {/* =================================================
                    USER
                ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  {/* AVATAR */}

                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-emerald-100
                      border
                      border-emerald-200
                      flex
                      items-center
                      justify-center
                      text-emerald-700
                      text-sm
                      font-black
                    "
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  {/* USER NAME */}

                  <div className="leading-tight">
                    <p
                      className="
                        text-[13px]
                        font-bold
                        text-slate-800
                      "
                    >
                      {user?.name || "User"}
                    </p>

                    <p
                      className="
                        text-[10px]
                        font-medium
                        text-slate-400
                        capitalize
                        mt-0.5
                      "
                    >
                      {user?.role}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    text-red-600
                    text-[13px]
                    font-bold
                    transition-all
                    duration-200
                    hover:bg-red-100
                    hover:border-red-300
                  "
                >
                  <LogOut size={16} strokeWidth={2.2} />
                  Logout
                </button>
              </div>
            )}

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                lg:hidden
                ml-3
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                flex
                items-center
                justify-center
                text-slate-700
                transition-all
                duration-200
                hover:bg-emerald-50
                hover:text-emerald-700
              "
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <div
          className={`
            lg:hidden
            absolute
            left-0
            right-0
            top-[76px]
            bg-white
            border-b
            border-slate-200
            shadow-[0_15px_35px_rgba(15,23,42,0.08)]
            transition-all
            duration-300
            ${
              menuOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }
          `}
        >
          <div className="p-4 space-y-1">
            {!token ? (
              <>
                {/* HOME */}

                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <House size={18} />
                  Home
                </Link>

                {/* LEADERBOARD */}

                <Link
                  to="/leaderboard"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <Trophy size={18} />
                  Leaderboard
                </Link>

                {/* LOGIN */}

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <LogIn size={18} />
                  Login
                </Link>

                {/* REGISTER */}

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* =================================================
                    LEADERBOARD
                ================================================= */}

                <Link
                  to="/leaderboard"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <Trophy size={18} />
                  Leaderboard
                </Link>

                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                {/* =================================================
                    ANALYTICS
                ================================================= */}

                <Link
                  to="/analytics"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <BarChart3 size={18} />
                  Analytics
                </Link>

                {/* =================================================
                    DONOR
                ================================================= */}

                {user?.role === "donor" && (
                  <div className="pt-2">
                    <p
                      className="
                        px-4
                        py-2
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-slate-400
                      "
                    >
                      Donations
                    </p>

                    {/* CREATE DONATION */}

                    <Link
                      to="/donor/create-donation"
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Utensils size={18} />
                      Create Donation
                    </Link>

                    {/* MY DONATIONS */}

                    <Link
                      to="/donor/my-donations"
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Package size={18} />
                      My Donations
                    </Link>
                  </div>
                )}

                {/* =================================================
                    NGO / VOLUNTEER
                ================================================= */}

                {(user?.role === "ngo" || user?.role === "volunteer") && (
                  <>
                    <Link
                      to="/ngo/available-donations"
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Search size={18} />
                      Available Donations
                    </Link>

                    <Link
                      to="/ngo/my-claims"
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Heart size={18} />
                      My Claims
                    </Link>
                  </>
                )}

                {/* =================================================
                    ADMIN
                ================================================= */}

                {user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin/users"
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Users size={18} />
                      Manage Users
                    </Link>

                    <Link
                      to="/admin/donations"
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Package size={18} />
                      Manage Donations
                    </Link>
                  </>
                )}

                {/* =================================================
                    MOBILE USER
                ================================================= */}

                <div
                  className="
                    mt-3
                    pt-4
                    border-t
                    border-slate-100
                    flex
                    items-center
                    justify-between
                    px-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-emerald-100
                        border
                        border-emerald-200
                        flex
                        items-center
                        justify-center
                        text-emerald-700
                        font-black
                      "
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {user?.name}
                      </p>

                      <p className="text-[11px] text-slate-400 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  {/* MOBILE REWARD */}

                  {user?.role === "donor" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        px-2.5
                        py-1.5
                        rounded-lg
                        bg-emerald-50
                        border
                        border-emerald-200
                      "
                    >
                      <Coins size={14} className="text-emerald-600" />

                      <span
                        className="
                          text-xs
                          font-bold
                          text-emerald-700
                        "
                      >
                        {myRewards?.coins || 0}
                      </span>
                    </div>
                  )}
                </div>

                {/* =================================================
                    MOBILE LOGOUT
                ================================================= */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    mt-3
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    py-3
                    rounded-xl
                    bg-red-50
                    border
                    border-red-100
                    text-red-600
                    font-bold
                  "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
