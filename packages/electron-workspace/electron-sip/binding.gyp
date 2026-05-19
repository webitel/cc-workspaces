{
  "variables": {
    "pjsip_prefix%": "<!(node -e \"process.stdout.write(process.env.PJSIP_PREFIX || '')\")"
  },
  "targets": [
    {
      "target_name": "electron-sip",
       'cflags!': [ '-fno-exceptions' ],
       'cflags_cc!': [ '-fno-exceptions' ],
       'xcode_settings': {
         'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
         'CLANG_CXX_LIBRARY': 'libc++',
         'MACOSX_DEPLOYMENT_TARGET': '11.0',
       },
       'msvs_settings': {
         'VCCLCompilerTool': { 'ExceptionHandling': 1, 'RuntimeLibrary': 2 },
       },
       'conditions': [
         ['OS=="win"', {
           'defines': [ '_HAS_EXCEPTIONS=1', 'WIN32', '_WIN32', '_ITERATOR_DEBUG_LEVEL=0', '_HAS_ITERATOR_DEBUGGING=0', 'PJMEDIA_HAS_GSM_CODEC=0', 'PJMEDIA_HAS_SPEEX_CODEC=0', 'PJMEDIA_HAS_SRTP=0' ],
           "include_dirs": [
             "<(pjsip_prefix)/include"
           ],
           "link_settings": {
             "libraries": [
               "<(pjsip_prefix)/lib/pjsua2-lib.lib",
               "<(pjsip_prefix)/lib/pjsua-lib.lib",
               "<(pjsip_prefix)/lib/pjsip-ua.lib",
               "<(pjsip_prefix)/lib/pjsip-simple.lib",
               "<(pjsip_prefix)/lib/pjsip-core.lib",
               "<(pjsip_prefix)/lib/pjmedia-codec.lib",
               "<(pjsip_prefix)/lib/pjmedia-audiodev.lib",
               "<(pjsip_prefix)/lib/pjmedia.lib",
               "<(pjsip_prefix)/lib/pjnath.lib",
               "<(pjsip_prefix)/lib/pjlib-util.lib",
               "<(pjsip_prefix)/lib/pjlib.lib",
               "<(pjsip_prefix)/lib/libresample.lib",
               "ws2_32.lib",
               "iphlpapi.lib",
               "dnsapi.lib",
               "winmm.lib",
               "ole32.lib",
               "oleaut32.lib"
             ]
           }
         }],
         ['OS=="linux"', {
           'defines': [ 'PJ_LINUX=1', 'PJMEDIA_HAS_SRTP=0' ],
           "include_dirs": [
             "<!@(pkg-config --cflags-only-I libpjproject | sed 's/-I//g')"
           ],
           "cflags_cc": [
             "<!@(pkg-config --cflags libpjproject)"
           ],
           "libraries": [
             "<!@(pkg-config --libs libpjproject)",
             "-lasound",
             "-lstdc++",
             "-lm",
             "-lpthread"
           ]
         }],
         ['OS=="mac"', {
           'defines': [ 'PJ_AUTOCONF=1', 'PJ_IS_BIG_ENDIAN=0', 'PJ_IS_LITTLE_ENDIAN=1' ],
           "include_dirs": [
             "<!@(brew --prefix pjproject)/include"
           ],
           "libraries": [
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjsua2-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjsua-*-apple-darwin*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjsip-ua-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjsip-simple-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjsip-*-apple-darwin*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjmedia-codec-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjmedia-audiodev-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjmedia-videodev-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjmedia-*-apple-darwin*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjnath-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpjlib-util-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libpj-*-apple-darwin*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libsrtp-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libresample-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libspeex-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libgsmcodec-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libilbccodec-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libg7221codec-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libyuv-*.a)",
             "<!@(echo <!@(brew --prefix pjproject)/lib/libwebrtc-*.a)",
             "-L<!@(brew --prefix openssl@3)/lib",
             "-lssl",
             "-lcrypto",
             "-lm",
             "-lpthread",
             "-framework CoreAudio",
             "-framework CoreServices",
             "-framework AudioUnit",
             "-framework AudioToolbox",
             "-framework Foundation",
             "-framework AppKit",
             "-framework AVFoundation",
             "-framework CoreGraphics",
             "-framework QuartzCore",
             "-framework CoreVideo",
             "-framework CoreMedia",
             "-framework Metal",
             "-framework MetalKit",
             "-framework VideoToolbox",
             "-framework Security"
           ]
         }]
       ],
      "sources": [
        "main.cpp", "sip_client.cpp", "sip_call.cpp", "sip_account.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('napi-thread-safe-callback').include\")",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_VERSION=3', 'NAPI_CPP_EXCEPTIONS',  '_HAS_EXCEPTIONS=1', 'STATIC', '_UNICODE', 'UNICODE', '_CRT_SECURE_NO_DEPRECATE',
        'USER_AGENT_NAME=\"Webitel softphone v.dev.win\"'
       ]
    }
  ]
}
