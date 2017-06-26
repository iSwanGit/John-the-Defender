# John-the-Defender
고승완, 김준현, 송문혁

## Abstract
2017-1H 정보보호 Project  
HTTPS 연결이 가능한 페이지의 비보안 연결이나 SSL Strip에 의한 변조 공격을 탐지하는 것이 주 목적  
Chrome Extension을 사용하여 구현

## 시나리오
(current commit)  
HTTP인 경우 HTTPS로 강제하여 request 전송.  
1. Response가 돌아온다 (200 OK)
- SSL 사용하나 서버의 페이지 보안 수준이 낮다
- **혹은 SSL Strip 등의 MITM attack을 당하고 있는 중 (최초 페이지에서 미끼 링크만 strip되어있는 상태)**
2. 보안 에러가 발생한다 (net::ERR_INSECURE_RESPONSE)
- **(특히 중도에 검증할 경우) HSTS bypassing / SSL Strip 공격을 받음**
- 단, Self-signed Certificate 의 경우에도 이 에러가 발생.
- (브라우저에서는 ERR_CERT_ 로 구분 가능하나, XHR에서는 INSECURE로 퉁쳐짐)
3. 응답이 오지 않는다 (net::ERR_CONNECTION_REFUSED)
- 서버에서 HTTPS 연결을 지원하지 않는다

## 테스트를 위한 공격 툴
[Bettercap](https://www.bettercap.org/docs/install.html)