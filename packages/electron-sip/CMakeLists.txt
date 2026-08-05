cmake_minimum_required(VERSION 3.12)
project(electron-sip)

set(CMAKE_CXX_STANDARD 14)

add_definitions(-DPJMEDIA_HAS_SRTP=0)


include_directories(thrid_party/pjproject/pjsip/include)
include_directories(thrid_party/pjproject/pjlib-util/include)
include_directories(thrid_party/pjproject/pjmedia/include)
include_directories(thrid_party/pjproject/pjnath/include)
include_directories(thrid_party/pjproject/pjlib/include)

#include(FindPkgConfig)
#find_package(PkgConfig REQUIRED)
#find_package(Threads REQUIRED)
#pkg_check_modules(PJSIP IMPORTED_TARGET libpjproject REQUIRED)

#find_package(PkgConfig REQUIRED)
#pkg_search_module(OPENSSL REQUIRED openssl)

#SET(CMAKE_BUILD_TYPE Debug FORCE)


include_directories(thrid_party/pjproject/pjsip/include)
include_directories(thrid_party/pjproject/pjlib-util/include)
include_directories(thrid_party/pjproject/pjmedia/include)
include_directories(thrid_party/pjproject/pjnath/include)
include_directories(thrid_party/pjproject/pjlib/include)

include_directories(${PJSIP_INCLUDE_DIRS})
link_directories(${PJSIP_LIBRARY_DIRS})


#pkg_check_modules(PJSIP libpjproject REQUIRED)

add_definitions(-DUSER_AGENT_NAME="Webitel softphone v.dev.linux")

# Include Node
include_directories(${CMAKE_JS_INC})
include_directories(/home/igor/.cmake-js/node-x64/v14.10.1/include/node)
include_directories(node_modules/napi-thread-safe-callback)

#add_executable(electron_sip main.cpp)

file(GLOB SOURCE_FILES "sip_client.cpp" ,
        "sip_account.cpp" ,
        "sip_call.cpp" ,
        "sip_endpoint.h" ,
        "main.cpp"
        )

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

link_directories(/usr/local/lib/)
set(PJSIP_TargetCPU "x86_64")
set (PJSIP_LIBRARIES
        pjsua2-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjsua-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjsip-ua-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjsip-simple-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjsip-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjmedia-codec-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjmedia-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjmedia-videodev-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjmedia-audiodev-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjnath-${PJSIP_TargetCPU}-unknown-linux-gnu
        pjlib-util-${PJSIP_TargetCPU}-unknown-linux-gnu
        srtp-${PJSIP_TargetCPU}-unknown-linux-gnu
        resample-${PJSIP_TargetCPU}-unknown-linux-gnu
        gsmcodec-${PJSIP_TargetCPU}-unknown-linux-gnu
#        speex-${PJSIP_TargetCPU}-unknown-linux-gnu
#        ilbcodec-${PJSIP_TargetCPU}-unknown-linux-gnu
        g7221codec-${PJSIP_TargetCPU}-unknown-linux-gnu
        portaudio-${PJSIP_TargetCPU}-unknown-linux-gnu
        pj-${PJSIP_TargetCPU}-unknown-linux-gnu
        )
set (PJSIP_STATIC_LIBRARIES1
        ${PJSIP_LIBRARIES}
        stdc++
        m
        rt
        pthread
        asound
        SDL2
        avformat
        avcodec
        swscale
        avutil
        speex
#        v4l2
        crypto
        ssl
#        opencore-amrnb
#        opencore-amrwb
#        opencore-amrwbenc
        )


message(${PJSIP_STATIC_LIBRARIES1})

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${OPENSSL_LIBRARIES} ${PJSIP_STATIC_LIBRARIES1} )
target_link_libraries(${PROJECT_NAME} "crypto")
# Include N-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

# define NPI_VERSION
add_definitions(-DNAPI_VERSION=4)
add_definitions(-DPJ_LINUX=1)

install(TARGETS ${PROJECT_NAME} DESTINATION ${PROJECT_SOURCE_DIR}/build/Debug)


add_executable(DDD exe.cpp)
target_link_libraries(DDD ${CMAKE_SOURCE_DIR}/lib/win/pjsua2-lib-x86_64-x64-vc14-Debug-Static.lib
        ${CMAKE_SOURCE_DIR}/lib/win/libpjproject-x86_64-x64-vc14-Debug.lib
        ${CMAKE_SOURCE_DIR}/lib/win/pjnath-x86_64-x64-vc14-Debug-Static.lib
        ${CMAKE_SOURCE_DIR}/lib/win/pjmedia-x86_64-x64-vc14-Debug-Static.lib
        ${CMAKE_SOURCE_DIR}/lib/win/pjlib-util-x86_64-x64-vc14-Debug-Static.lib
        ${CMAKE_SOURCE_DIR}/lib/win/pjsip-ua-x86_64-x64-vc14-Debug-Static.lib
        ${CMAKE_SOURCE_DIR}/lib/win/pjlib-x86_64-x64-vc14-Debug-Static.lib
        )