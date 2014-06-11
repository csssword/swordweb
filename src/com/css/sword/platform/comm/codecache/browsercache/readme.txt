

=====================================================================
                         �����˴���?��������
=====================================================================

ԭ�? 
	������?�浽browser���ڵĲ���ϵͳ��Ӳ���У����������applet���?

��������㷨��
	1. ϵͳ��ʼ�������Ϊ��
	2. �û���ȡ���ʱ��ֱ�Ӵӱ����ļ���ȡ
	3. ����Ӳ����û�ж�Ӧ����ݣ����web����������ָ������ݣ������浽����Ӳ���У��������û���
	4. ���ػ�����ݰ����趨���¼����ʱ��web���������
	
����ӿڣ�
	1. ��ʾ����� testapplet.html
	
�ļ���ɣ�
	1. BrowserCacheManager.java ���������Applet
	2. BrowserCacheTable.java   �������
	3. BrowserCacheLog.java     ��־��¼����
	4. Test.java                demo�������ó���
	5. appletdeploy.bat         applet����ʾ��ű�
	6. keystore                 ֤���ļ����������ǩ����
	7. testapplet.html          ʾ��webҳ�����


����ʾ��
	1. ��web.xml���������servlet������Ϣ
		<!--================================================================-->
		<!--         WebCodeCacheServlet��startup servlet��                    -->
		<!--================================================================-->
		<servlet>
			<servlet-name>WebCodeCacheServlet</servlet-name>
			<servlet-class>com.css.sword.platform.comm.codecache.WebCodeCacheServlet</servlet-class>
			<load-on-startup>3</load-on-startup>
		</servlet>
		<servlet-mapping>
			<servlet-name>WebCodeCacheServlet</servlet-name>
			<url-pattern>/WebCodeCacheServlet</url-pattern>
		</servlet-mapping>
		
	2. ִ��appletdeploy.bat�ű������applet�Ĵ��ͷ���
	
	3. ��������з���testapplet.html���򼴿ɡ�
	
