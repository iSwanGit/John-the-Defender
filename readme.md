# John-the-Defender
고승완, 김준현, 송문혁

## Abstract
2017-1H 정보보호 Project  
HTTPS 연결이 가능한 페이지의 비보안 연결이나 SSL Strip에 의한 변조 공격을 탐지하는 것이 주 목적  
Chrome Extension을 사용하여 구현

## 시나리오
(current commit)  
HTTP인 경우 HTTPS로 강제하여 request 전송.  
Response가 돌아오면 서비스 제공자의 보안문제, 혹은 SSL Strip 등의 MITM attack을 당하고 있는 중  
올바른 response가 돌아오지 않으면 HTTPS 연결을 지원하지 않는 서버..