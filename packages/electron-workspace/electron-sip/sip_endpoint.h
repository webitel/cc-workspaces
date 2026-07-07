//
// Created by igor on 11/11/20.
//

#pragma once

#include <pjsua2.hpp>
#include "sip_account.h"

namespace SIP {
    class SipEndpoint : public pj::Endpoint {
    public:
        SipEndpoint() : Endpoint() {

        };
        ~SipEndpoint() = default;
    };
}
