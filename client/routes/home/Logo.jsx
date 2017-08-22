// @flow
import * as React from 'react';

type Props = {
  className?: string,
};

const Logo = (props: Props) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 762.5 160"
    preserveAspectRatio="xMidYMid"
    className={props.className}
  >
    <defs>
      <linearGradient id="a" y1="12.0327" x2="24.4092" y2="12.0327" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#a29fa0" />
      </linearGradient>
      <linearGradient id="b" x1="12.705" y1="24.0655" x2="12.705" y2="19.1768" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#817f7f" />
        <stop offset="0.0443" stopColor="#908e8e" />
        <stop offset="0.1283" stopColor="#a5a3a4" />
        <stop offset="0.2274" stopColor="#b6b4b5" />
        <stop offset="0.3501" stopColor="#c1bfc0" />
        <stop offset="0.5222" stopColor="#c8c6c7" />
        <stop offset="1" stopColor="#cac8c9" />
      </linearGradient>
      <linearGradient id="c" x1="21.1948" y1="11.7842" x2="24.4092" y2="11.7842" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#9b9999" />
        <stop offset="0.4525" stopColor="#999797" />
        <stop offset="0.6155" stopColor="#939091" />
        <stop offset="0.7317" stopColor="#878585" />
        <stop offset="0.8256" stopColor="#777474" />
        <stop offset="0.9061" stopColor="#615e5f" />
        <stop offset="0.976" stopColor="#484345" />
        <stop offset="1" stopColor="#3d383a" />
      </linearGradient>
      <linearGradient id="d" x1="20.1986" y1="21.6794" x2="22.7649" y2="20.0604" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#cac8c9" />
        <stop offset="0.503" stopColor="#7b7879" />
        <stop offset="1" stopColor="#9b9999" />
      </linearGradient>
      <linearGradient id="e" y1="12.2295" x2="5.4243" y2="12.2295" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#cac8c9" />
        <stop offset="0.0755" stopColor="#dbdada" />
        <stop offset="0.18" stopColor="#ebebeb" />
        <stop offset="0.3102" stopColor="#f7f6f6" />
        <stop offset="0.4929" stopColor="#fdfdfd" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient id="f" x1="2.6913" y1="20.1253" x2="4.4302" y2="21.6181" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#cac8c9" />
      </linearGradient>
      <linearGradient id="g" x1="21.8132" y1="1.5605" x2="20.4221" y2="-0.2645" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#9b9999" />
        <stop offset="1" stopColor="#e6e5e6" />
      </linearGradient>
      <linearGradient id="h" x1="3.0144" y1="1.1148" x2="3.4566" y2="0.1217" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#e6e5e6" />
      </linearGradient>
      <linearGradient id="i" x1="4.0337" y1="10.397" x2="21.3667" y2="10.397" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#b4b2b2" />
        <stop offset="0.1076" stopColor="#c3c2c2" />
        <stop offset="0.2489" stopColor="#cfcdcd" />
        <stop offset="0.4478" stopColor="#d5d4d4" />
        <stop offset="1" stopColor="#d7d6d6" />
      </linearGradient>
      <linearGradient id="j" x1="4.1191" y1="10.397" x2="21.2812" y2="10.397" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#c2c1c1" />
        <stop offset="0.0246" stopColor="#c4c3c3" />
        <stop offset="0.371" stopColor="#d9d9d9" />
        <stop offset="0.7023" stopColor="#e7e6e6" />
        <stop offset="1" stopColor="#ebebeb" />
      </linearGradient>
      <linearGradient id="k" x1="4.206" y1="10.398" x2="21.1948" y2="10.398" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#d1d0cf" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <symbol id="btn-key" viewBox="0 0 24.48 24" preserveAspectRatio="xMinYMin">
        <path
          d="M2.2432,0H22.166a2.2432,2.2432,0,0,1,2.2432,2.2432V21.8243a2.2412,2.2412,0,0,1-2.2412,2.2412H2.2422A2.2422,2.2422,0,0,1,0,21.8233V2.2432A2.2432,2.2432,0,0,1,2.2432,0Z"
          fill="url(#a)"
        />
        <path
          d="M19.8486,19.1768l-14.0151.24-4.2388,4.55a2.1873,2.1873,0,0,0,.6485.0987H22.167a2.2428,2.2428,0,0,0,1.6484-.7227Z"
          fill="url(#b)"
        />
        <path
          d="M21.1948,18.5967l2.6714,4.6865a2.2215,2.2215,0,0,0,.543-1.4609V2.2412a2.2426,2.2426,0,0,0-1.147-1.956L21.1948,1.4629Z"
          fill="url(#c)"
        />
        <path
          d="M24.4092,21.8223v-.1895l-3.9785-4.1367-1.3374,2.2432,1.8632,4.3262h1.21A2.2431,2.2431,0,0,0,24.4092,21.8223Z"
          fill="url(#d)"
        />
        <path
          d="M4.8384,1.5274.3848.9873A2.23,2.23,0,0,0,0,2.2412V21.8223a2.2281,2.2281,0,0,0,.727,1.6494l4.6973-4.2949Z"
          fill="url(#e)"
        />
        <path d="M.0972,22.4766a2.2425,2.2425,0,0,0,2.146,1.5889h.39l4.0913-5.5166L5.1123,18.03Z" fill="url(#f)" />
        <path
          d="M22.167,0H2.2432a2.2811,2.2811,0,0,0-.3384.0235l3.91,1.8535H18.93L22.9941.1563A2.2963,2.2963,0,0,0,22.167,0Z"
          fill="#e6e5e6"
        />
        <path d="M22.167,0H19.94L18.603.8291l1.8848,1.7373,3.9062-.5859A2.2438,2.2438,0,0,0,22.167,0Z" fill="url(#g)" />
        <path
          d="M.2539,1.2061l4.1836.4912L5.8144.9346,3.9907,0H2.2432A2.2408,2.2408,0,0,0,.2539,1.2061Z"
          fill="url(#h)"
        />
        <path
          d="M6.45.3926H18.9526a2.4141,2.4141,0,0,1,2.4141,2.4141v15.18a2.415,2.415,0,0,1-2.415,2.415H6.45a2.416,2.416,0,0,1-2.416-2.416V2.8086A2.416,2.416,0,0,1,6.45.3926Z"
          fill="url(#i)"
        />
        <path
          d="M6.4487.48H18.955a2.3262,2.3262,0,0,1,2.3262,2.3262V17.984a2.3295,2.3295,0,0,1-2.3295,2.3295H6.4472a2.3281,2.3281,0,0,1-2.3281-2.3281V2.81A2.33,2.33,0,0,1,6.4487.48Z"
          fill="url(#j)"
        />
        <path
          d="M6.4511.5655h12.501a2.2427,2.2427,0,0,1,2.2427,2.2427v15.18A2.2427,2.2427,0,0,1,18.9521,20.23H6.4491A2.2431,2.2431,0,0,1,4.206,17.9874V2.8106A2.2451,2.2451,0,0,1,6.4511.5655Z"
          fill="url(#k)"
        />
      </symbol>
      <symbol id="lwjgl-letters" viewBox="0 0 496.9146 139.4473" fill="#fff" preserveAspectRatio="xMinYMin">
        <path d="M0,137.0967V2.2568H9.3091v126.377H63.3765v8.4629Z" />
        <path d="M177.5674,137.0967h-7.71L139.8608,35.6377a60.6035,60.6035,0,0,1-2.5386-12.6943h-.376q-.2827,4.1389-2.915,12.5063l-31.9707,101.647H94.35L54.293,2.2568H64.73l30.748,108.041q2.0669,7.3345,2.915,11.9424h.376a96.0207,96.0207,0,0,1,3.291-11.9424L135.3477,2.2568h4.7017l30.56,108.041a117.377,117.377,0,0,1,2.915,11.9424h.376a52.1794,52.1794,0,0,1,1.5049-6.0186L206.999,2.2568H217.06Z" />
        <path d="M279.064,83.5928q0,27.082-12.5527,41.4678-12.5537,14.3877-36.3433,14.3867a51.7305,51.7305,0,0,1-19.6523-3.667V107.2891a28.2106,28.2106,0,0,0,17.49,5.9238q20.78,0,20.78-30.8418V2.2568H279.064Z" />
        <path d="M404.82,128.0693q-19.7461,11.3789-49.084,11.3779-32.5342,0-51.293-18.0068t-18.76-49.6011q0-31.7812,20.499-51.811Q326.68,0,360.72,0q21.438,0,37.8,5.9238V34.415q-15.6094-9.0264-38.1768-9.0269-18.8994,0-30.7949,12.271t-11.8945,32.77q0,20.7832,10.6729,32.1592,10.67,11.3774,28.82,11.377,10.9058,0,17.3018-3.1025V84.5332H347.4614v-24.26H404.82Z" />
        <path d="M496.9146,137.0967H416.6118V2.2568h30.3721V112.4609h49.9307Z" />
      </symbol>
      <filter id="three" colorInterpolationFilters="sRGB" x="0" y="0" height="100%" width="100%">
        <feColorMatrix type="matrix" values="0.60 0 0 0 0 0.60 0 0 0 0 1.00 0 0 0 0 0 0 0 1 0" />
      </filter>
      <filter id="wasd" colorInterpolationFilters="sRGB" x="0" y="0" height="100%" width="100%">
        <feColorMatrix type="matrix" values="0.60 0 0 0 0 0.60 0 0 0 0 0.60 0 0 0 0 0 0 0 1 0" />
      </filter>
    </defs>
    <title>LWJGL</title>
    <use xlinkHref="#btn-key" x="0" y="2" width="50" height="50" />
    <use xlinkHref="#btn-key" x="51" y="2" width="50" height="50" />
    <use xlinkHref="#btn-key" x="102" y="2" width="50" height="50" filter="url(#three)" />
    <use xlinkHref="#btn-key" x="25" y="53" width="50" height="50" />
    <use xlinkHref="#btn-key" x="76" y="53" width="50" height="50" filter="url(#wasd)" />
    <use xlinkHref="#btn-key" x="127" y="53" width="50" height="50" />
    <use xlinkHref="#btn-key" x="38" y="104" width="50" height="50" filter="url(#wasd)" />
    <use xlinkHref="#btn-key" x="89" y="104" width="50" height="50" filter="url(#wasd)" />
    <use xlinkHref="#btn-key" x="140" y="104" width="50" height="50" filter="url(#wasd)" />
    <use xlinkHref="#lwjgl-letters" x="210" y="0" height="155" />
    <text x="115" y="36" style={{ fontSize: 12, fontWeight: 700 }}>
      3
    </text>
  </svg>;

export default Logo;
